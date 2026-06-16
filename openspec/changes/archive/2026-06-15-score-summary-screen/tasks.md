## 1. Application — Store & Facade

- [x] 1.1 Add `elapsedSeconds: number` field to `RegisterRepetitionsState` (default `0`) in `register-repetitions.store.ts`
- [x] 1.2 Add `readonly elapsedSeconds` computed signal to `RegisterRepetitionsStore`
- [x] 1.3 Add `setElapsedSeconds(seconds: number): void` mutation method to `RegisterRepetitionsStore`
- [x] 1.4 Add `readonly elapsedSeconds` computed passthrough to `RegisterRepetitionsFacade`
- [x] 1.5 Add `recordElapsedTime(seconds: number): void` method to `RegisterRepetitionsFacade` (delegates to `store.setElapsedSeconds`)
- [x] 1.6 Add `async finalizeScore(signature: string): Promise<void>` to `RegisterRepetitionsFacade` — updates `scores.status = 'submitted'` via Supabase, stores signature in `value.signature`; calls `unsubscribeRealtime()`; sets `isSubmitting` true/false around the call; sets `error` on failure
- [x] 1.7 Add `readonly movementSummaryItems` computed to `RegisterRepetitionsFacade` — maps `movements` + `repetitionRecords` into a structure the summary list can render, WOD-type aware
- [x] 1.8 Write unit tests for `RegisterRepetitionsStore` new fields in `register-repetitions.store.spec.ts`
- [x] 1.9 Write unit tests for `RegisterRepetitionsFacade.finalizeScore()`, `recordElapsedTime()`, and `movementSummaryItems` in `register-repetitions.facade.spec.ts`

## 2. UI Dumb Components

- [x] 2.1 Keep `ResultHeroComponent` in `libs/contexts/score/src/feature/components/result-hero/` and export it from the feature index
- [x] 2.2 Refactor `RoundBreakdownListComponent` to accept a WOD-type-aware input:
  - Inputs: `heading: string`, `wodType: WodType`, `breakdown: SummaryBreakdown`
  - Renders AMRAP rounds, For Time movements, For Load weight, or EMOM minutes accordingly
  - Touch targets ≥ 48px per row (display only)
- [x] 2.3 Keep `SignaturePadComponent` in `libs/contexts/score/src/feature/components/signature-pad/`
- [x] 2.4 Remove `PenaltiesBannerComponent` and `StepProgressComponent` from the summary flow
- [x] 2.5 Write component tests for `RoundBreakdownListComponent` covering at least AMRAP and For Time render paths

## 3. Feature — Summary Page

- [x] 3.1 Refactor `SummaryPage` component at `libs/contexts/score/src/feature/pages/summary/summary.page.ts`
  - Injects `RegisterRepetitionsFacade` and `Router`
  - On `ngOnInit`: if `facade.athleteHeat()` is null → redirect to `/heat-access`
  - Displays: athlete name, bib number, division, lane, heat name, WOD name, WOD type
  - Displays: `ResultHeroComponent` with the primary metric for the WOD type
  - Displays: `RoundBreakdownListComponent` with `facade.movementSummaryItems()`
  - Displays: elapsed time formatted as MM:SS from `facade.elapsedSeconds()`
  - Displays: `SignaturePadComponent` for athlete signature
  - "Confirm & Submit" button: calls `facade.finalizeScore(signature)` then navigates to `/heat-confirmation`; disabled + spinner while `facade.isSubmitting()`
  - Error message displayed when `facade.error()` is non-null
- [x] 3.2 Update `summary.page.html` template to use the new component composition
- [x] 3.3 Ensure `summary` child route in `score.router.ts` loads `SummaryPage`
- [x] 3.4 Write/update component tests for `SummaryPage` (null athleteHeat redirect, renders breakdown, signature required, submit CTA) in `summary.page.spec.ts`

## 4. Feature — Register Repetitions Page Navigation

- [x] 4.1 Ensure `Router` is injected into `RegisterRepetitionsPage`
- [x] 4.2 In `onConfirm()`: after `facade.submitRepetitionCount()`, check `facade.canNavigateNext()`; if false → call `facade.recordElapsedTime(elapsedSeconds())` and navigate to `./summary` (relative route)
- [x] 4.3 Remove the `effect()` based auto-navigation and `refreshGuard` if present
- [x] 4.4 Update existing tests in `register-repetitions.page.spec.ts` to cover last-movement navigation to summary

## 5. Cleanup — Remove Separate Summary Layer

- [x] 5.1 Delete `libs/contexts/score/src/application/summary.store.ts`
- [x] 5.2 Delete `libs/contexts/score/src/application/summary.store.spec.ts`
- [x] 5.3 Delete `libs/contexts/score/src/application/summary.facade.ts`
- [x] 5.4 Delete `libs/contexts/score/src/infrastructure/summary.repository.ts`
- [x] 5.5 Delete `libs/contexts/score/src/infrastructure/summary.repository.supabase.ts`
- [x] 5.6 Delete `libs/contexts/score/src/domain/summary.model.ts` or simplify to only `MovementSummaryItem` if still useful
- [x] 5.7 Remove `SummaryFacade` and `SUMMARY_REPOSITORY` exports/providers from `score.providers.ts` and `index.ts` barrel files

## 6. STOP — Visual Validation

- [ ] 6.1 Serve the judge app (`nx serve judge`) and manually navigate through all 5 mock movements to reach the summary screen
- [ ] 6.2 Verify: athlete context, result hero, WOD breakdown, elapsed time, signature pad, and "Confirm & Submit" CTA render correctly
- [ ] 6.3 **Await explicit user approval before proceeding**

## 7. Infrastructure — Finalize Score

- [ ] 7.1 Verify `finalizeScore()` in `RegisterRepetitionsFacade` correctly updates `scores.status = 'submitted'` against real Supabase (manual smoke test with a dev heat)
- [ ] 7.2 Confirm realtime subscription is unsubscribed after finalization
- [ ] 7.3 Confirm navigation to `/heat-confirmation` lands on the correct athlete list for the heat
