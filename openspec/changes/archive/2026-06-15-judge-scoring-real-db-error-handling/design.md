## Context

The judge scoring flow currently supports a mock-data path (`loadHeat()` without `heatAthleteId`) that loads `MOCK_ATHLETE_HEAT` and `MOCK_MOVEMENTS`. This made early UI development possible, but it now hides two real problems:

1. **No real persistence guarantee**: judges can complete the full scoring flow without ever writing to Supabase.
2. **No error surface**: Supabase failures in `loadHeatData()`, `submitRepetitionCount()`, and `finalizeScore()` set a string on the facade but never show a consistent UI. Some errors are swallowed by `catch` blocks and only appear in the console.

As the app moves toward the MVP demo, the scoring flow must require a real `heatAthleteId`, persist every action to Supabase, and display failures through a unified error-handling mechanism.

## Goals / Non-Goals

**Goals:**
- Remove the mock-data fallback from the scoring facade and pages.
- Require a valid `heatAthleteId` to enter the scoring flow; redirect to `/heat-access` otherwise.
- Ensure every score-related write (`repetition_records` upsert and `scores` finalization) targets real Supabase.
- Introduce a judge-wide error-code registry (`H00{n}`) for business errors.
- Provide a reusable error modal for unexpected/500 errors with a generic message.
- Integrate the error modal into the summary submission flow.

**Non-Goals:**
- Offline queue or retry logic beyond a single retry button.
- Changing admin, leaderboard, or heat apps beyond what the score context requires.
- Refactoring repository patterns outside the scoring flow.
- Adding new visual design for the error modal beyond Tailwind + existing tokens.

## Decisions

### 1. Remove mock data instead of gating it behind an environment flag

**Decision:** Delete `MOCK_ATHLETE_HEAT`, `MOCK_MOVEMENTS`, `MOCK_REPETITION_RECORDS`, and the `loadMockData()` branch from `RegisterRepetitionsFacade`. The scoring page will redirect to `/heat-access` when no `heatAthleteId` is present.

**Rationale:** A feature-flagged mock path would still allow demo users to accidentally enter mock mode. Removing it forces the team to fix real data issues now rather than at the demo.

**Alternative considered:** Keep mocks behind `isDevMode()` for local UI iteration. Rejected: the project is close enough to MVP that the real heat-access flow should be the daily path.

---

### 2. Centralize error handling in `apps/judge/src/app/core/`

**Decision:** Create `ErrorCodeRegistry` (constant map) and `ErrorHandlingService` in the judge app core. The registry maps `H00{n}` codes to messages. The service exposes a `showError(error: unknown)` method that decides whether to render the generic 500 modal or a business-error message.

**Rationale:** Error handling is an app-level concern, not a library concern. The judge app owns the UI surface and the user-facing messages. Keeping it in `apps/judge` prevents cross-app coupling and lets other apps define their own copy later if needed.

**Alternative considered:** Put the registry in `libs/core`. Rejected: messages are UX copy and should live with the app that displays them; `libs/core` should stay framework-agnostic utilities.

---

### 3. Error-code format: `H00{n}`

**Decision:** Business errors use codes `H001`, `H002`, etc. HTTP 500/unexpected errors do **not** get a code; they use the generic modal.

**Rationale:** A short prefix makes codes grep-able and avoids collisions with backend error formats. Reserving `H00` for business errors leaves room for future categories.

---

### 4. Error modal behavior

**Decision:** A single `ErrorModalComponent` accepts a title, message, and optional action label. The `ErrorHandlingService` opens it via a programmatic API (signal-based state) rather than inline in every page.

**Rationale:** A service-driven modal avoids scattering modal state across pages and makes it easy to trigger errors from facades or repositories without passing UI callbacks down the stack.

---

### 5. Repository errors reach the facade and the UI

**Decision:** `RegisterRepetitionsFacade` continues to catch errors and set `store.error`. The page components will additionally call `ErrorHandlingService.showError()` for fatal persistence failures (e.g., `finalizeScore()` fails, `loadHeat()` cannot find the heat assignment).

**Rationale:** The facade already owns the error state for inline display (CTA disabled, spinner). The error service handles the "something went wrong, stop the flow" cases.

## Risks / Trade-offs

- **[Risk] Removing mock data makes local development harder** → Mitigation: developers must navigate through `/heat-access` and select a real/dev heat. A seeded dev environment should be maintained.
- **[Risk] Supabase dev instability blocks UI work** → Mitigation: the error modal gives clear feedback, and the existing repository abstractions make it easy to reintroduce a controlled test double later if needed.
- **[Risk] Generic 500 message is unhelpful for debugging** → Mitigation: log the original error to the console; the modal tells the user to retry or contact support.
- **[Risk] Business error list grows organically and becomes inconsistent** → Mitigation: central registry with required code/message pairs; new codes need a code-owner review.

## Migration Plan

1. Merge the change.
2. Seed the dev Supabase project with at least one heat and one athlete/team so the judge flow can be tested end-to-end.
3. Update the QA checklist to verify the error modal appears when the network/Supabase is unavailable.
4. No rollback strategy needed; the mock path is additive removal.
