## Why

After the judge confirms the last repetition record in the scoring screen, there is no summary or final submission step. The score remains in `draft` status indefinitely — it is never transitioned to `submitted`. The judge has no way to review what was recorded before committing, and there is no clear end to the scoring flow.

This is the final step of the judge's 4-step flow: after registering all repetitions, the judge must review the complete breakdown and explicitly confirm the final score before returning to the heat athlete list.

## What Changes

A new `/scoring/:heatAthleteId/summary` page is introduced. When the judge confirms the last movement repetition, the app navigates automatically to this page instead of staying on the scoring screen.

The summary page displays:
- Athlete context: name, bib number, division, lane, heat name, WOD name, and WOD type.
- A full breakdown of every movement with confirmed repetition counts vs. target reps.
- Total repetition count.
- Elapsed time (carried from the scoring timer).
- A single "Confirm & Submit" CTA that transitions the score status from `draft` to `submitted` and navigates back to `/heat-confirmation`.

No penalty or dispute functionality is included in this change.

## Capabilities

### New Capabilities

- `score-summary-screen`: New route and page component that presents the full scoring summary and triggers final score submission.

### Modified Capabilities

- `rep-submission-confirmation`: The submission flow now includes a final confirmation step. After all movements are recorded, navigation goes to the summary page rather than staying on the scoring screen.

## Impact

- `libs/contexts/score/src/application/register-repetitions.facade.ts` — new `finalizeScore()` method, elapsed time stored in the store.
- `libs/contexts/score/src/application/register-repetitions.store.ts` — new `elapsedSeconds` and `finalized` state fields.
- `libs/contexts/score/src/feature/score.router.ts` — new child route `summary`.
- `libs/contexts/score/src/feature/pages/score-summary/` — new page component (smart container).
- `libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.ts` — navigates to summary on last movement confirmation.
- `apps/judge/src/app/app.routes.ts` — no change needed (lazy-loaded via `@hero/score`).
