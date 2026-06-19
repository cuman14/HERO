## 1. Numeric Keypad Component Changes

- [x] 1.1 Remove "0" digit key from the keys array
- [x] 1.2 Add `targetReps` input and `completePressed` output to the component class
- [x] 1.3 Add `complete` key type to the union type and keys array
- [x] 1.4 Add template rendering for the "complete" key type (Complete button with targetReps display)

## 2. Register Repetitions Page Wiring

- [x] 2.1 Bind `[targetReps]` and `(completePressed)` on `<lib-numeric-keypad>` in the template
- [x] 2.2 Add `onComplete(targetReps: number)` handler that sets count + confirms + navigates
