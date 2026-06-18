## Context

The `MovementStackCardComponent` in `libs/ui/src/molecules/movement-stack-card/` currently displays:
- Up to 2 stacked completed cards (absolute positioning, z-index 10 and 20)
- 1 active movement card (z-index 30)
- Floating timer chip

Judges completing a WOD with 3+ movements cannot review earlier completed movements. The Plane work item HERO-18 requests an accordion to expand and view all completed movements.

## Goals / Non-Goals

**Goals:**
- Add collapsible accordion above active card showing all completed movements
- Preserve current stacked-card visual when collapsed (zero visual regression)
- Smooth expand/collapse animation (300ms, ease-out)
- Header clickable in full width (not just chevron)
- Accessible: keyboard navigable, aria-expanded, aria-controls
- Reactive: updates automatically when `completedItems` changes

**Non-Goals:**
- Pull-down/pull-up touch gestures (decided: button/chevron only)
- Editing completed movements from the accordion (read-only review)
- Persisting expanded state across page navigations
- Changes to active card design or upcoming movements list

## Decisions

### 1. Local signal state vs model input

**Decision**: `expanded = signal(false)` local to component.

**Rationale**: 
- Expansion is purely UI state, not business state
- Parent (`RegisterRepetitionsPage`) has no need to control or persist it
- Keeps component self-contained as a "dumb" presentation component with minimal UI state

**Alternative considered**: `model()` input/output for parent control. Rejected — adds unnecessary coupling for a transient UI state.

### 2. Layout switch strategy

**Decision**: Conditional template with `@if (expanded())` rendering two distinct layouts:
- **Collapsed**: Current absolute-positioned stacked cards (unchanged)
- **Expanded**: Single vertical list container (relative positioning) with all completed items

**Rationale**: 
- Absolute positioning of stacked cards cannot accommodate variable-height list
- Clean separation avoids complex CSS overrides
- Each layout optimized for its mode

### 3. Accordion header visibility

**Decision**: Show header only when `completedItems().length > 0`

**Rationale**: No completed movements = no review needed. Avoids empty interactive element.

### 4. Chevron rotation animation

**Decision**: CSS `transition-transform duration-200` on `expand_more` / `expand_less` icon

**Rationale**: Consistent with existing component animation language (cubic-bezier, 300-450ms).

### 5. Expanded list content

**Decision**: Each row shows: checkmark icon, movement name, `currentReps/targetReps reps`, round label

**Rationale**: Uses existing `MovementStackItem` fields (`name`, `currentReps`, `targetReps`, `roundLabel`). Matches information density of stacked cards but in list form.

### 6. Animation approach

**Decision**: CSS `max-height` transition on the list container + `opacity` fade:
- Collapsed: `max-height: 0, opacity: 0`
- Expanded: `max-height: 500px (sufficient), opacity: 1`
- Transition: `max-height 300ms ease-out, opacity 200ms ease-out`

**Rationale**: 
- Pure CSS, no Angular animations dependency
- Works with Angular's `@if` (element removed/added) via `@keyframes` enter/leave or `::ng-deep` not needed
- Actually, with `@if` the element is destroyed/created — need `@angular/animations` for enter/leave OR use `[hidden]` with CSS transitions. **Correction**: Use `@if` with `@angular/animations` trigger for proper enter/leave animations, or simpler: keep element always-render always with `[class.hidden]`.

**Revised decision**: Always render the list container, toggle visibility with `[class.max-h-0]` / `[class.max-h-96]` + `[class.opacity-0]` / `[class.opacity-100]` Tailwind classes driven by `expanded()` signal. This avoids animation library and works with signal-based class binding.

### 7. Expanded state persistence across movement completion

**Decision**: Do NOT reset `expanded` when a new movement is completed (added to `completedItems`).

**Rationale**: Judge opened accordion to review; auto-closing would be disruptive. The list updates reactively via `completedItems()` computed.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `max-height` transition requires fixed max value; content may exceed | Set generous `max-h-96` (384px ≈ 12 items); overflow hidden |
| Clicking header while scrolling page may conflict | Header is small (~48px), distinct from main scroll area; acceptable |
| Stacked cards (collapsed) and list (expanded) show duplicate data when 1-2 items | Acceptable — collapsed shows visual stack metaphor, expanded shows full list |
| No gesture support may disappoint users expecting swipe | Button/chevron is more discoverable and accessible; gesture can be added later as enhancement |

## Migration Plan

1. Create feature branch `feature/ui-movement-stack-card-expand-completed`
2. Modify `movement-stack-card.component.ts`:
   - Add `expanded = signal(false)`
   - Add accordion header template (conditional on `completedItems().length > 0`)
   - Add vertical list template (always rendered, visibility toggled via classes)
   - Add CSS for accordion styles and transitions
3. Run lint/typecheck/test
4. Visual validation in judge app register-repetitions page
5. Merge to main

Rollback: Revert component file — no database/API changes.