## 1. UI Component Implementation

- [x] 1.1 Add `expanded` signal state to `MovementStackCardComponent`
- [x] 1.2 Add accordion toggle button (icon in top-right corner, conditional on `completedItems().length > 0`)
- [x] 1.3 Add chevron icon with rotation transition based on `expanded()` state
- [x] 1.4 Add vertical list container (always rendered) with `max-height` and `opacity` class bindings driven by `expanded()` signal
- [x] 1.5 Implement list item template showing: checkmark, movement name, "currentReps/targetReps reps", round label
- [x] 1.6 Hide stacked cards when `expanded()` is true using conditional rendering
- [x] 1.7 Add ARIA attributes to toggle button: `role="button"`, `aria-expanded`, `aria-controls`, `tabindex="0"`, `aria-label`
- [x] 1.8 Add keyboard handler for Enter/Space on button to toggle expansion

## 2. Styling and Animations

- [x] 2.1 Add toggle button styles: padding, background, border, hover/focus states, minimum 48x48px touch target
- [x] 2.2 Add vertical list container styles: overflow-hidden, transition for max-height (300ms ease-out) and opacity (200ms ease-out)
- [x] 2.3 Add list item styles: flex layout, gap, typography matching component design system
- [x] 2.4 Add chevron rotation transition (200ms) using Tailwind transform utilities
- [x] 2.5 Ensure collapsed state preserves existing stacked card animations unchanged

## 3. Testing

- [x] 3.1 Create unit tests for `expanded` signal toggle behavior
- [x] 3.2 Create unit tests for toggle button click handler
- [x] 3.3 Create unit tests for keyboard activation (Enter/Space)
- [x] 3.4 Create unit tests for list rendering with multiple completed items
- [x] 3.5 Create unit tests for conditional stacked cards visibility
- [x] 3.6 Create unit tests for ARIA attributes presence and correctness

## 4. Visual Validation (STOP_POINT)

- [x] 4.1 Run judge app and navigate to register-repetitions page
- [x] 4.2 Verify collapsed state shows stacked cards identically to current behavior
- [x] 4.3 Verify toggle button appears when completed items exist
- [x] 4.4 Verify button click expands accordion with smooth animation
- [x] 4.5 Verify expanded list shows all completed movements with correct data
- [x] 4.6 Verify chevron rotates on expand/collapse
- [x] 4.7 Verify new completed movement appears in list without collapsing
- [x] 4.8 Verify keyboard navigation works (Tab to button, Enter/Space to toggle)
- [x] 4.9 Verify touch targets meet 48x48px minimum on mobile viewport
- [x] 4.10 Verify no visual regressions in active card or upcoming movements

## 5. Quality Gates

- [x] 5.1 Run `npx nx lint ui` — zero errors
- [x] 5.2 Run `npx nx typecheck ui` — zero errors
- [x] 5.3 Run `npx nx test ui` — all tests pass
- [x] 5.4 Run `npx nx affected -t build` — build succeeds