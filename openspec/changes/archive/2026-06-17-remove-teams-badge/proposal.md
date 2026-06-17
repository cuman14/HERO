## Why

In the heat-confirmation listing, team cards display a "TEAMS" badge that is redundant since every card in the teams section is a team. This clutters the UI with unnecessary information.

## What Changes

- Hide the `categoryLabel` badge on `AthleteCardComponent` when `type === 'team'`
- All other category badges (RX, SCALED, MASTERS) continue to display for individual athletes

## Capabilities

### New Capabilities

_(none — this is a modification to existing UI behavior, not a new capability)_

### Modified Capabilities

_(none — this is a visual-only change with no spec-level requirement changes)_

## Impact

- **Component**: `libs/ui/src/molecules/athlete-card/athlete-card.component.ts` — conditionally hide the category badge span when type is `'team'`
- **Consumer**: `heat-confirmation` page (both `.ts` and `.html` variants) — no changes needed; they already pass `type` correctly
- No API, database, or state changes
