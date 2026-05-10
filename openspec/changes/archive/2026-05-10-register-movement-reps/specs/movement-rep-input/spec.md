## ADDED Requirements

### Requirement: Repetition Count Input
Judges must be able to enter and modify the repetition count for the current movement during a heat.

#### Scenario: Judge increments repetition count via button
- **WHEN** judge taps the increment button on the repetition counter
- **THEN** the repetition count increases by 1 and the UI updates immediately with visual feedback

#### Scenario: Judge decrements repetition count via button
- **WHEN** judge taps the decrement button on the repetition counter
- **THEN** the repetition count decreases by 1 (minimum 0) and the UI updates immediately with visual feedback

#### Scenario: Judge enters repetition count directly
- **WHEN** judge taps the repetition count input field and enters a numeric value
- **THEN** the repetition count is updated to the entered value and the UI reflects the change

#### Scenario: Judge attempts to enter invalid repetition count
- **WHEN** judge enters a non-numeric value or negative number in the repetition count field
- **THEN** the input is rejected and an error message is displayed

### Requirement: Repetition Count Persistence
The repetition count for each movement must be saved and synchronized across all connected judges.

#### Scenario: Judge submits repetition count
- **WHEN** judge taps the submit button after entering a repetition count
- **THEN** the repetition count is saved to the database and a confirmation message is displayed

#### Scenario: Repetition count is synchronized in real-time
- **WHEN** another judge submits a repetition count for the same movement
- **THEN** the current judge's screen updates automatically to reflect the new count

### Requirement: Movement Navigation
Judges must be able to navigate between movements in the current heat without losing the state of entered repetition counts.

#### Scenario: Judge navigates to next movement
- **WHEN** judge taps the next movement button
- **THEN** the screen displays the next movement and any previously entered repetition count for that movement is restored

#### Scenario: Judge navigates to previous movement
- **WHEN** judge taps the previous movement button
- **THEN** the screen displays the previous movement and any previously entered repetition count for that movement is restored

#### Scenario: Judge attempts to navigate with unsaved changes
- **WHEN** judge has entered a repetition count but not submitted it and attempts to navigate to another movement
- **THEN** a confirmation dialog is displayed asking if the judge wants to discard the unsaved changes

### Requirement: Athlete and Movement Information Display
The screen must clearly display the current athlete's information and the active movement.

#### Scenario: Athlete information is displayed
- **WHEN** the register movement repetitions screen is loaded
- **THEN** the current athlete's name, bib number, and division are displayed at the top of the screen

#### Scenario: Movement information is displayed
- **WHEN** the register movement repetitions screen is loaded
- **THEN** the current movement's name and description are displayed prominently

#### Scenario: Movement progress is indicated
- **WHEN** the judge is viewing the movement repetitions screen
- **THEN** a visual indicator shows the current movement's position in the sequence (e.g., "Movement 3 of 5")

### Requirement: Visual Feedback
The UI must provide clear visual feedback for all user actions and system state changes.

#### Scenario: Unsaved changes are indicated
- **WHEN** judge has entered a repetition count but not submitted it
- **THEN** a visual indicator (e.g., color change or icon) shows that there are unsaved changes

#### Scenario: Submission confirmation is displayed
- **WHEN** judge successfully submits a repetition count
- **THEN** a brief confirmation message or animation is displayed to confirm the action

#### Scenario: Error feedback is displayed
- **WHEN** an error occurs during submission (e.g., network error)
- **THEN** an error message is displayed with options to retry or cancel
