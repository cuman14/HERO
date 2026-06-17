## Why

The heat confirmation page footer hardcodes `judge = { id: '', name: '' }`, so the judge name is never displayed. The judge name should be fetched from the database (profiles table) using the `judgeId` already flowing through the repository layer.

## What Changes

- Add `judge` field (with `id` and `name`) to `HeatConfirmationPayload`
- Update `HeatConfirmationMapper` to include `profiles` query and map to judge info
- Update `HeatRepositorySupabase` to fetch the profile display_name alongside the heat data
- Update `HeatConfirmationPage` to read judge info from the payload and display in footer

## Capabilities

### New Capabilities
- `heat-judge-name`: Judge name resolution for heat confirmation — fetch and display the assigned judge's name from the profiles table using the judgeId parameter

### Modified Capabilities
- `heat-confirmation`: Update the heat confirmation page to pass judge info through the payload and display in the footer

## Impact

- `libs/contexts/heat/src/domain/heat-confirmation.model.ts` — Add `judge` field to `HeatConfirmationHeat` or add it to payload
- `libs/contexts/heat/src/infrastructure/heat.repository.ts` — Add `judge` to `HeatConfirmationPayload`
- `libs/contexts/heat/src/infrastructure/heat-confirmation.mapper.ts` — Map judge info
- `libs/contexts/heat/src/infrastructure/heat.repository.supabase.ts` — Fetch profile data
- `libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts` — Use judge from payload in footer template
