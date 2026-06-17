## 1. UI Component Change

- [x] 1.1 Add `isTeam` computed to `AthleteCardComponent` that returns `true` when `type() === 'team'`
- [x] 1.2 Wrap the `categoryLabel` badge span with `@if (!isTeam())` to hide it on team cards
- [x] 1.3 Verify no regressions: badge still shows for non-team card types (RX, SCALED, MASTERS)

## 2. Verification

- [x] 2.1 Run `npx nx lint ui` to ensure no lint errors
- [x] 2.2 Run `npx nx test ui` to ensure all existing tests pass
