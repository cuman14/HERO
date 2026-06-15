## Why

The scoring flow currently falls back to hard-coded mock data when no `heatAthleteId` is provided, which masks missing integrations and allows judges to "submit" scores that never reach Supabase. As the MVP demo approaches, the judge app must guarantee real persistence and surface failures clearly instead of silently swallowing errors.

## What Changes

- **Remove the mock-data fallback** from `RegisterRepetitionsFacade.loadHeat()`. The scoring page will require a valid `heatAthleteId`; loading without one will show an error and redirect to `/heat-access`.
- **Enforce real persistence** for repetition records and final score submission. Every `submitRepetitionCount()` and `finalizeScore()` call will hit Supabase; the local-only mock path is deleted.
- **Introduce a judge-wide error-handling system** in `apps/judge`:
  - A registry of business error codes (`H00{n}`) with human-readable messages.
  - A generic error modal for HTTP 500/unexpected failures with a standard message.
  - Business errors are displayed with their specific code and message.
- **Update the score summary page** so that final submission navigates to `/heat-confirmation` only after a successful Supabase update, and shows the error modal on failure.

## Capabilities

### New Capabilities

- `judge-error-handling`: Centralized business error code registry (`H00{n}` format) and a reusable error modal for the judge app.

### Modified Capabilities

- `movement-rep-input`: Remove the mock-data fallback; require a real `heatAthleteId` and fail visibly when the heat assignment cannot be loaded.
- `rep-submission-confirmation`: Persist scores to Supabase instead of the mock path; handle and display persistence errors using the new error-handling system.

## Impact

- `apps/judge/src/app/core/` or equivalent core module: new error-code registry and error-modal component.
- `libs/contexts/score/src/application/register-repetitions.facade.ts`: remove `loadMockData()` and mock data imports.
- `libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.ts`: redirect on missing/invalid `heatAthleteId`.
- `libs/contexts/score/src/feature/pages/summary/summary.page.ts`: integrate error modal on `finalizeScore()` failure.
- `apps/judge/src/app/app.config.ts` or bootstrap: provide the error-handling service globally.
