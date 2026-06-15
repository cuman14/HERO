## Context

The judge app scoring flow currently ends abruptly: after the last movement repetition is confirmed, `navigateNext()` is a no-op and the judge sees no change. The score stays in `draft` status in Supabase indefinitely. There is no review step and no explicit submission.

This change closes the loop: the store captures elapsed time when the last repetition is confirmed, the facade exposes a `finalizeScore()` operation, a new `ScoreSummaryPage` renders the complete review, and on confirmation the score is marked `submitted` and the judge is returned to the heat athlete list.

## Goals / Non-Goals

**Goals:**
- Introduce `/scoring/:heatAthleteId/summary` as a child route of the existing score feature.
- Auto-navigate to the summary page when the last movement is confirmed.
- Display athlete context, the primary result metric (reps / time / weight / rounds), a WOD-type-aware breakdown, and elapsed time.
- Capture an athlete signature confirming the recorded score.
- Provide a single "Confirm & Submit" action that updates `scores.status` to `submitted` and navigates to `/heat-confirmation`.
- Keep all state in the existing `RegisterRepetitionsFacade` / `RegisterRepetitionsStore` — no new store.

**Non-Goals:**
- Penalties, disputes, or any score correction on this screen.
- A separate score finalization service or repository method beyond a Supabase `UPDATE`.
- A flow-wide step progress indicator.
- Any change to the leaderboard or admin apps.

## Decisions

### 1. Elapsed time lives in the store, not the URL

**Decision:** Add `elapsedSeconds: number` to `RegisterRepetitionsState`. The page sets it via `facade.recordElapsedTime(seconds)` before navigating to summary.

**Rationale:** Query params would pollute the URL and be visible/editable by the user. Passing through Angular router state is fragile on PWA reload. The store is already the source of truth for this session's data.

**Alternative considered:** Angular router `state` object (navigation extras). Rejected: lost on hard reload / direct URL access.

---

### 2. New child route, same feature providers

**Decision:** Add `{ path: 'summary', loadComponent: SummaryPage }` as a child of the `:heatAthleteId` route in `score.router.ts`. The route reuses `provideScoreFeature()` from the parent.

**Rationale:** The summary page needs the same `RegisterRepetitionsFacade` instance that was alive during scoring. Placing it as a sibling (same provider scope via the parent route's `providers`) achieves this without refactoring the provider tree.

**Alternative considered:** Separate top-level route `/scoring-summary/:heatAthleteId` with its own providers and a fresh data load. Rejected: requires re-fetching data already in memory.

---

### 3. `finalizeScore()` is a facade method, not a use-case class

**Decision:** Add `async finalizeScore(): Promise<void>` to `RegisterRepetitionsFacade`. It calls `supabase.from('scores').update({ status: 'submitted' }).eq('id', scoreId)`, then calls `unsubscribeRealtime()`.

**Rationale:** The operation is a single Supabase call with no domain logic — extracting it to a use-case would be over-engineering for this scope. The facade already holds both the `supabase` client and `unsubscribeRealtime`.

**Alternative considered:** A `ScoreRepository` method. Deferred — can be refactored later without changing the public API.

---

### 4. Dumb component decomposition

The page is a smart container (`SummaryPage`) that reads from the facade and renders three dumb components:

| Component | Location | Inputs |
|---|---|---|
| `SummaryPage` | `feature/pages/summary/` | — (smart, injects facade) |
| `ResultHeroComponent` | `feature/components/result-hero/` | `label`, `value`, `unit`, `timeCap` |
| `RoundBreakdownListComponent` | `feature/components/round-breakdown-list/` | `heading`, `wodType`, `breakdown` |
| `SignaturePadComponent` | `feature/components/signature-pad/` | `signed` output |

The breakdown adapts to the WOD type:

| WOD Type | Primary metric (ResultHero) | Breakdown display |
|---|---|---|
| AMRAP | Total reps | Rounds with reps per movement |
| For Time | Total time | Movements completed |
| For Load / RM | Max weight | Single weight entry |
| EMOM | Rounds completed / total | Per-minute completion status |

---

### 5. Navigation after last movement confirmation

**Decision:** In `RegisterRepetitionsPage.onConfirm()`, after calling `facade.submitRepetitionCount()`, check `facade.canNavigateNext()`. If false (last movement), record elapsed time and navigate to `./summary` via `Router`.

**Rationale:** The page already owns the `elapsedSeconds` signal and has access to `Router`. This is the minimal change point.

---

### 6. Mock strategy

`SummaryPage` reads from the same facade. The existing `MOCK_ATHLETE_HEAT` and `MOCK_MOVEMENTS` provide sufficient mock data. No additional stubs are needed for the summary page — it becomes accessible in dev mode via `/scoring` (no param) → confirm all 5 movements → lands on summary.

## Risks / Trade-offs

- **Store lifetime on direct URL access** → If the judge navigates directly to `/scoring/:id/summary` (e.g., browser back after app restart), the store is empty. The page MUST redirect to `/heat-access` if `athleteHeat()` is null. This mirrors the guard pattern in `heat-confirmation-summary`.

- **`finalizeScore()` is fire-and-forget in error path** → If the Supabase update fails, the score stays `draft`. Mitigation: show an error toast and keep the CTA enabled for retry. The judge can tap again.

- **Elapsed time accuracy** → The timer is JS `setInterval` — it can drift if the app is backgrounded (PWA). This is acceptable for a demo; the time is indicative, not used for ranking in this phase.
