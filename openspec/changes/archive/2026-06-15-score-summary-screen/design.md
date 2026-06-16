## Context

The judge app scoring flow currently ends abruptly: after the last movement repetition is confirmed, `navigateNext()` is a no-op and the judge sees no change. The score stays in `draft` status in Supabase indefinitely. There is no review step and no explicit submission.

This change closes the loop: the store captures elapsed time when the last repetition is confirmed, the facade exposes a `finalizeScore()` operation, a new `ScoreSummaryPage` renders the complete review, and on confirmation the score is marked `submitted` and the judge is returned to the heat athlete list.

## Goals / Non-Goals

**Goals:**
- Introduce `/scoring/:heatAthleteId/summary` as a child route of the existing score feature.
- Auto-navigate to the summary page when the last movement is confirmed.
- Support a **read-only entry** from the heat confirmation athlete list: tapping a scored athlete opens the same summary URL in read-only mode.
- Display athlete context, the primary result metric (reps / time / weight / rounds), a WOD-type-aware breakdown, and elapsed time.
- Capture an athlete signature confirming the recorded score (only in post-scoring mode).
- Provide a single "Confirm & Submit" action that updates `scores.status` to `submitted` and navigates to `/heat-confirmation`.
- Provide a "Volver" button (read-only mode) that navigates back to `/heat-confirmation`.
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

---

### 7. Read-only mode for pre-submitted scores

**Context:** `HeatConfirmationPage.onAthleteClick()` navigates scored athletes to `/scoring/:heatAthleteId/summary`. These athletes have `scores.status = 'submitted'` (determined by `fetchSubmittedScores` in the heat repository). The summary store is empty on entry — no data was pre-loaded.

**Decision:** Detect mode by store state in `SummaryPage.ngOnInit()`:

| Condition | Mode | Behavior |
|---|---|---|
| `heatAthleteId` present AND `athleteHeat()` null | **Read-only** | Call `facade.loadHeat(heatAthleteId)`, set `isReadOnly` flag |
| `athleteHeat()` exists (store populated from scoring flow) | **Post-scoring** | Existing flow with signature + submit |
| Neither | — | Redirect to `/heat-access` |

While the store is loading in read-only mode, a loading spinner is shown. If loading fails, the error state is displayed with a retry option.

**Read-only mode UI:**
- **Signature pad** — hidden. No athlete signature is needed for already-submitted scores.
- **"Confirm & Submit" button** — hidden. The score is already submitted.
- **"Volver" button** — visible. Navigates to `/heat-confirmation` (carries `heatCode` as query param from `athleteHeat.heatName`).
- **"Corregir datos" button** — visible. Navigates to `/scoring/:heatAthleteId` (the scoring screen) so the judge can re-enter the scoring flow with existing data loaded, make corrections, and re-submit. `finalizeScore()` performs an UPDATE — re-submitting overwrites the same row.

**Post-scoring mode UI (unchanged):**
- Signature pad + "Confirm & Submit" visible.
- "Corregir datos" → `location.back()` (back to scoring screen).
- No "Volver" button (navigating away before submit would lose the session).

**Rationale:** Store state is the most reliable signal — it requires no URL hacks, survives PWA reloads, and naturally distinguishes the two entry paths without adding state to the store just for mode detection.

**Alternative considered:** A query param `?readonly=true`. Rejected: pollutes the URL, visible to the user, can be manipulated.

---

### 8. "Volver" button in read-only mode

**Decision:** A secondary button labeled "Volver" is rendered below the content area in read-only mode only. On click, it navigates to `/heat-confirmation` with `heatCode` derived from `facade.athleteHeat().heatName`.

**Rationale:** In read-only mode the judge has no pending submission; the natural exit is back to the athlete list. Using the facade's loaded data avoids needing to store the heat code separately.

---

### 9. "Corregir datos" in read-only mode

**Decision:** In read-only mode, "Corregir datos" navigates to `/scoring/:heatAthleteId` (the parent route). This enters `RegisterRepetitionsPage` which calls `facade.loadHeat(id)`, loading existing movements and repetition records from Supabase. The judge can then modify counts and re-confirm movements, which flows back to the post-scoring summary.

**Rationale:** Even for `submitted` scores, the judge may need to correct data. The existing `loadRealData()` and `findOrCreateScore()` already handle this case — the score row exists, so `findOrCreateScore` returns the existing ID and `mergeRecordsWithMovements` loads existing records. Re-submitting via `finalizeScore()` simply `UPDATE`s the same row.

**Risk:** The judge could accidentally navigate away mid-edit. Mitigated by the same guard pattern in `RegisterRepetitionsPage` (redirect to `/heat-access` on data loss).

## Risks / Trade-offs

- **Store lifetime on direct URL access** → If the judge navigates directly to `/scoring/:id/summary` without `heatAthleteId` (e.g., browser back after app restart, or hitting `/scoring/summary` with no param), the store is empty and there's no ID to load from. The page redirects to `/heat-access`. If `heatAthleteId` IS present, the page calls `loadHeat()` to populate the store — this covers both read-only mode and hard reloads on the summary URL.

- **`finalizeScore()` is fire-and-forget in error path** → If the Supabase update fails, the score stays `draft`. Mitigation: show an error toast and keep the CTA enabled for retry. The judge can tap again.

- **Elapsed time accuracy** → The timer is JS `setInterval` — it can drift if the app is backgrounded (PWA). This is acceptable for a demo; the time is indicative, not used for ranking in this phase.
