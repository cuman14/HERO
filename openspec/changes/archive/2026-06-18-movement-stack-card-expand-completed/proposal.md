## Why

During live scoring, judges complete multiple movements in sequence but can only see the last 2 completed movements as stacked cards. There is no way to review earlier completed movements to verify rep counts or check the sequence. This feature adds an accordion to expand and view all completed movements.

## What Changes

- Add collapsible accordion section above the active movement card showing all completed movements
- Add expand/collapse toggle button in the accordion header (clickable header area)
- When expanded: show vertical list of all completed movements with name, reps, and round
- When collapsed: preserve current stacked-card visual (max 2 cards)
- Smooth height animation for expand/collapse transitions
- No changes to active card design or upcoming movements list

## Capabilities

### New Capabilities

- `movement-completed-review`: Accordion component for judges to expand and review all completed movements in a heat, showing movement name, target reps, and round label for each completed item

### Modified Capabilities

- None — this adds a new review capability without changing existing movement-rep-input, rep-counter-ui, or movement-navigation requirements

## Impact

- **Affected Code**: `libs/ui/src/molecules/movement-stack-card/movement-stack-card.component.ts` (template, styles, signals)
- **New Dependencies**: None (uses existing Angular signals, Tailwind v4)
- **APIs**: None — purely presentational component
- **Systems**: Judge app scoring workflow (register-repetitions page)