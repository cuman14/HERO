## 1. Judge Error Handling Core

- [x] 1.1 Create `apps/judge/src/app/core/error-handling/error-code.registry.ts` with a readonly map of `H00{n}` codes to messages and an initial set of codes (e.g., H001 = "Heat assignment not found", H002 = "Score could not be saved").
- [x] 1.2 Create `apps/judge/src/app/core/error-handling/error-handling.service.ts` with a `showError(error: unknown)` method that distinguishes business errors, HTTP 500 errors, and unknown errors.
- [x] 1.3 Create `apps/judge/src/app/core/error-handling/error-modal.component.ts` (dumb component) with inputs for `title`, `message`, and `actionLabel`, and an output `action`.
- [x] 1.4 Provide `ErrorHandlingService` globally in `apps/judge/src/app/app.config.ts`.
- [x] 1.5 Write unit tests for `ErrorHandlingService` and `ErrorCodeRegistry`.
- [x] 1.6 Write component tests for `ErrorModalComponent`.

## 2. Remove Mock Data from Scoring

- [x] 2.1 Delete `libs/contexts/score/src/application/mock-heat-data.ts` and all its imports.
- [x] 2.2 Remove the `loadMockData()` method and the no-argument branch from `RegisterRepetitionsFacade.loadHeat()`.
- [x] 2.3 Update `RegisterRepetitionsFacade.loadHeat()` signature to require `heatAthleteId: string`.
- [x] 2.4 Update `RegisterRepetitionsPage.ngOnInit()` to redirect to `/heat-access` when `heatAthleteId` is missing.
- [x] 2.5 Update `RegisterRepetitionsPage` tests to provide a `heatAthleteId` input and to verify the redirect behavior.
- [x] 2.6 Update `RegisterRepetitionsFacade` tests to remove mock-data expectations.

## 3. Real Persistence and Error Integration

- [x] 3.1 Remove fallback from `RegisterRepetitionsFacade.submitRepetitionCount()` — always uses `repRecordRepo.save()`.
- [x] 3.2 Surface persistence errors via `ScoreErrorHandler` in facade (`submitRepetitionCount`, `loadRealData`, `finalizeScore`).
- [x] 3.3 Inject `ScoreErrorHandler` into `SummaryPage` and call it when `finalizeScore()` fails.
- [x] 3.4 `SummaryPage` only navigates to `/heat-confirmation` after a successful `finalizeScore()` (try/catch).
- [x] 3.5 Update `SummaryPage` tests to verify error-handler invocation on submission failure.

## 4. Documentation and Verification

- [x] 4.1 Update `apps/judge/AGENTS.md` with error-handling section.
- [x] 4.2 Run `npx nx affected -t lint test build` — judge lint clean, judge test/build OK, score lint/test OK. Only `heat:test` fails (pre-existing, missing `setupTestBed()`).
- [x] 4.3 Perform a manual smoke test: start `nx serve judge`, navigate through `/heat-access` to a real/dev heat, score movements, submit the summary, and verify the score row in Supabase has `status = 'submitted'`.
