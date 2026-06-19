## ADDED Requirements

### Requirement: Complete button displays target repetitions

The numeric keypad SHALL display a "Complete" button showing the target repetitions for the current movement.

#### Scenario: Complete button shows target reps
- **GIVEN** a `NumericKeypadComponent` with `targetReps` set to `21`
- **WHEN** the component renders
- **THEN** a button with the text "Completado" and the number `21` is visible
- **AND** the "0" digit key is not present

#### Scenario: Complete button with default value
- **GIVEN** a `NumericKeypadComponent` with no `targetReps` provided
- **WHEN** the component renders
- **THEN** the Complete button shows `0` as the target value

### Requirement: Judge can complete movement via button press

The numeric keypad SHALL emit `completePressed` with the target repetition count when the Complete button is pressed.

#### Scenario: Pressing Complete emits target reps
- **GIVEN** a `NumericKeypadComponent` with `targetReps` set to `21`
- **WHEN** the user presses the Complete button
- **THEN** the component emits `completePressed` with value `21`

#### Scenario: RegisterRepetitionsPage handles complete event
- **GIVEN** the keypad is rendered inside `RegisterRepetitionsPage`
- **WHEN** `completePressed` fires with target reps
- **THEN** the repetition count is set to the target reps value
- **AND** the count is confirmed and navigation proceeds to the next movement
