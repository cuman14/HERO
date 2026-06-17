## Why

The current heat confirmation flow uses a checkbox-based selection pattern that requires two taps per athlete (select → continue), which is slow and disruptive for judges. For scored athletes, the checkbox doesn't add value since they navigate directly anyway. Replacing the checkbox with contextual icons (arrow/eye) eliminates the selection step, reduces taps, and makes the UI more informative at a glance — judges immediately see which athletes are done and which need scoring.

## What Changes

- **AthleteCardComponent**: Replace the right-side checkbox with a contextual icon
  - Not scored: show arrow icon (→) indicating "click to start scoring"
  - Already scored: show eye icon (👁) indicating "click to view summary"
- **HeatConfirmationPage**: Remove the selection mechanism (`selectedId`, `canContinue`, `toggleSelection`)
  - Click not-scored athlete → navigate to `/heat-confirmation-summary` (guardrail before scoring)
  - Click scored athlete → navigate to `/scoring/:id/summary?readonly=true` (existing SummaryPage)
- **Footer**: Remove the "Continuar" button entirely — navigation happens directly from card clicks
- **HeroIconComponent**: Add `eye` icon to the icon registry for the scored state
- **Styling**: Cards always use the same border style, except scored athletes get an accent border to visually differentiate

## Capabilities

### New Capabilities
- *(none; no new screens or standalone features)*

### Modified Capabilities
- `heat-confirmation-summary`: The navigation flow from heat-confirmation changes — non-scored athletes now navigate directly to heat-confirmation-summary (instead of toggle → continue), and scored athletes bypass it entirely going to SummaryPage. Update REQ-HEAT-CONFIRMATION-SCORED-CLICK to reflect direct navigation for both states and removal of selection toggle.

## Impact

- `libs/ui/src/molecules/athlete-card/athlete-card.component.ts` — Replace checkbox with arrow/eye conditional rendering
- `libs/ui/src/icons/hero-icon.component.ts` + `icons.ts` — Add `eye` icon
- `libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts` — Remove selection state, update onAthleteClick, remove footer button
- `libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.spec.ts` — Update tests
- `libs/ui/src/molecules/athlete-card/athlete-card.component.spec.ts` — Update tests
- `apps/judge/AGENTS.md` — Update the "Heat confirmation — scored indicator" section to reflect new icon behavior
