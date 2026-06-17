## 1. Domain Model

- [x] 1.1 Add `judge: { id: string; name: string }` field to `HeatConfirmationPayload` interface in `libs/contexts/heat/src/infrastructure/heat.repository.ts`
- [x] 1.2 Update `HeatConfirmationPayload` type to include optional nullable judge (handles missing judge gracefully)

## 2. Infrastructure — Repository

- [x] 2.1 Add `fetchJudgeProfile` private method in `HeatRepositorySupabase` that queries `profiles` table for `id` and `display_name` using the `judgeId`
- [x] 2.2 Update `getHeatConfirmationData` to fetch judge profile in parallel with existing queries using `combineLatest`
- [x] 2.3 Map judge profile result into `HeatConfirmationPayload` with `judge: { id: profile.id, name: profile.display_name }` (or `{ id: '', name: '' }` when null)

## 3. Feature — Page Component

- [x] 3.1 Replace hardcoded `judge = { id: '', name: '' }` with a computed from `heatPayload` in `HeatConfirmationPage`
- [x] 3.2 Add a sticky footer to the page template that displays `"Juez: {judge.name}"` when the judge name is non-empty
- [x] 3.3 Ensure the athlete list has bottom padding to not overlap the footer

## 4. Tests

- [x] 4.1 Add unit tests for `HeatRepositorySupabase.fetchJudgeProfile` and the updated `getHeatConfirmationData`
- [x] 4.2 Add unit tests for `HeatConfirmationPage` judge display behavior (judge name shown / hidden)
