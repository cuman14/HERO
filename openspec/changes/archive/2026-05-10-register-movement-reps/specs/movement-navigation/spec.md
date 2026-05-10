## ADDED Requirements

### Requirement: Movement List Navigation
Judges must be able to navigate through the list of movements in the current heat efficiently.

#### Scenario: Judge views movement list
- **WHEN** the register movement repetitions screen is loaded
- **THEN** a list of all movements in the current heat is displayed or accessible

#### Scenario: Judge navigates to next movement
- **WHEN** judge taps the next movement button or swipes right
- **THEN** the screen transitions to the next movement in the sequence

#### Scenario: Judge navigates to previous movement
- **WHEN** judge taps the previous movement button or swipes left
- **THEN** the screen transitions to the previous movement in the sequence

#### Scenario: Judge cannot navigate beyond last movement
- **WHEN** the current movement is the last in the sequence and judge attempts to navigate forward
- **THEN** the next button is disabled or the screen remains on the last movement

#### Scenario: Judge cannot navigate before first movement
- **WHEN** the current movement is the first in the sequence and judge attempts to navigate backward
- **THEN** the previous button is disabled or the screen remains on the first movement

### Requirement: Movement State Preservation
The repetition count state must be preserved when navigating between movements.

#### Scenario: Repetition count is preserved when navigating away
- **WHEN** judge enters a repetition count for a movement and navigates to another movement
- **THEN** the entered repetition count is stored in local state and not lost

#### Scenario: Repetition count is restored when returning to movement
- **WHEN** judge navigates back to a previously visited movement
- **THEN** the previously entered repetition count is restored and displayed

#### Scenario: Unsaved changes are indicated during navigation
- **WHEN** judge has unsaved changes and attempts to navigate to another movement
- **THEN** a visual indicator shows that the current movement has unsaved changes

### Requirement: Movement Selection
Judges must be able to quickly jump to a specific movement without navigating sequentially.

#### Scenario: Judge selects movement from list
- **WHEN** judge taps on a movement in the movement list
- **THEN** the screen displays the selected movement and its associated repetition count

#### Scenario: Movement selection is confirmed
- **WHEN** judge selects a movement from the list
- **THEN** the selected movement is highlighted or indicated as active
