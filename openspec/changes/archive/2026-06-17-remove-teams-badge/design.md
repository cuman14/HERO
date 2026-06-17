## Context

The `AthleteCardComponent` (`libs/ui/src/molecules/athlete-card/`) renders a `categoryLabel` badge for all card types. In `heat-confirmation`, team cards display "TEAMS" which is redundant since the section context already makes this clear.

## Goals / Non-Goals

**Goals:**
- Hide the `categoryLabel` badge on team cards (`type === 'team'`)
- Preserve badge functionality for individual athlete cards

**Non-Goals:**
- No changes to styling, layout, or behavior of individual cards
- No changes to the heat-confirmation page or any consumer of this component
- No database or API changes

## Decisions

- **Conditional rendering via `@if`**: Use Angular's native `@if (!isTeam())` control flow on the badge span rather than CSS-based hiding, to avoid rendering unnecessary DOM nodes.
- **New computed `isTeam`**: Add a simple `computed(() => this.type() === 'team')` rather than inlining the condition, keeping the template readable.

## Risks / Trade-offs

- Low risk — this is a pure presentation change with no state or data flow impact
- If other features rely on the badge being visible for teams, they would need their own conditional logic (currently no such usage exists)
