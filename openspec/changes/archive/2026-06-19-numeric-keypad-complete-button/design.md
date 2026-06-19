## Context

The `NumericKeypadComponent` is a dumb UI component used by `RegisterRepetitionsPage` (judge app) for entering repetition counts. It currently renders a 3-column grid with digits 1-9, backspace, 0, and confirm. The parent page provides no target context to the keypad — it only receives digit/backspace/confirm events.

A new "Complete" button is needed so judges can mark an athlete as having done the target reps without typing the number manually. This requires passing `targetReps` down to the keypad component.

## Goals / Non-Goals

**Goals:**
- Remove the unused "0" key from the keypad
- Add a `targetReps` input (`number`) to the component
- Add a "Complete" button displaying `targetReps` that emits `completePressed`
- Wire the new input/output in `RegisterRepetitionsPage`

**Non-Goals:**
- Auto-submitting or auto-navigating on complete (the parent chooses what to do)
- Styling changes beyond the new button
- Support for multiple keypad instances with different layouts

## Decisions

- **New key type `complete`** instead of a separate named slot: keeps the rendering loop uniform with existing keys. The type union becomes `'digit' | 'backspace' | 'confirm' | 'complete'`.
- **`targetReps` as `input<number>(0)`**: zero is a safe default — if unset, the button shows "0" and emits 0, which is harmless.
- **`completePressed` as `output<number>()`**: emits the `targetReps` value so the parent can decide whether to pre-fill, auto-confirm, or both.
- **Button replaces center of bottom row**: same position as the removed "0" key, preserving the 3-column grid layout.

## Risks / Trade-offs

- Adding `targetReps` makes the component slightly less generic, but it's still a self-contained dumb component. The alternative (passing a string for button label) would be more generic but unnecessary complexity — the keypad is only used in one context.
