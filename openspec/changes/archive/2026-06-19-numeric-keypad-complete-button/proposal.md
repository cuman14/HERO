## Why

The numeric keypad currently has a "0" digit key that is unused in scoring workflows — judges never need to enter zero as a repetition count. Instead, there should be a "Complete" button that lets judges quickly mark an athlete as having completed the target reps for the current movement, reducing manual entry and errors.

## What Changes

- **Remove** the `0` digit key from the keypad layout
- **Add** a `targetReps` input to receive target repetitions from the parent
- **Add** a "Complete" button showing `targetReps` that replaces the `0` key
- **Add** a `completePressed` output emitting `number` (the targetReps value)
- **Update** the register-repetitions page to pass `targetReps` and handle `completePressed`

## Capabilities

### New Capabilities

- `complete-button`: Quick-complete button that emits target repetitions for the current movement

### Modified Capabilities

_(none — this is purely a UI component change)_

## Impact

- **`libs/ui/src/molecules/numeric-keypad/numeric-keypad.component.ts`** — remove `0` key, add `targetReps` input, `completePressed` output, new key type
- **`libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.html`** — bind `[targetReps]` and `(completePressed)` on `<lib-numeric-keypad>`
- **`libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.ts`** — add `onComplete(targetReps: number)` handler
