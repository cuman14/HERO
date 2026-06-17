## Why

The heat confirmation page currently shows two tabs ("Equipos" and "Individual"). Product requirement (HERO-13) mandates removing the Individual tab — only teams are used for scoring in this flow. This simplifies the UI and eliminates dead code.

## What Changes

- Remove the `individual` tab option from the `tabs` array
- Switch `activeTab` to a fixed `'teams'` value (no tab switching)
- Delete the `individuals` computed (athlete filter for individual type)
- Simplify `resolvedTab` / `activeAthletes` logic to always use teams
- Remove `activeTab` signal and `onTabChange` handler since only one tab remains
- Simplify `onTabChange` removal means `activeTab` is no longer needed

## Capabilities

### New Capabilities

- `heat-confirmation`: Heat confirmation page — displays athletes in a heat grouped by category, with search and athlete card navigation. Previously had team/individual tabs; now teams-only.

### Modified Capabilities

None — no existing spec covers the heat confirmation page behavior.

## Impact

- `libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts` — removal of individual tab, individual athlete logic, and tab switching
- `libs/contexts/heat/src/domain/heat-confirmation.model.ts` — may need review if `HeatConfirmationAthlete['type']` values can be simplified
- No API/database changes
- No dependency changes
