## ADDED Requirements

### Requirement: Counter Component Interface
The repetition counter component must provide both button-based and direct input methods for entering repetition counts.

#### Scenario: Counter displays current repetition count
- **WHEN** the counter component is rendered
- **THEN** the current repetition count is displayed prominently in a large, readable font

#### Scenario: Increment button is accessible
- **WHEN** the counter component is rendered
- **THEN** an increment button with minimum 48x48px touch target is displayed and easily tappable

#### Scenario: Decrement button is accessible
- **WHEN** the counter component is rendered
- **THEN** a decrement button with minimum 48x48px touch target is displayed and easily tappable

#### Scenario: Direct input field is available
- **WHEN** the counter component is rendered
- **THEN** a numeric input field is displayed allowing direct entry of repetition counts

### Requirement: Counter Visual States
The counter component must clearly indicate its current state and any pending changes.

#### Scenario: Counter shows unsaved state
- **WHEN** the repetition count has been modified but not submitted
- **THEN** the counter displays a visual indicator (e.g., highlight or border color) showing unsaved changes

#### Scenario: Counter shows saved state
- **WHEN** the repetition count has been successfully submitted
- **THEN** the counter displays a visual indicator (e.g., color change or checkmark) showing the count is saved

#### Scenario: Counter shows loading state
- **WHEN** the repetition count is being submitted to the server
- **THEN** the counter displays a loading indicator (e.g., spinner) and disables input temporarily

### Requirement: Counter Input Validation
The counter component must validate input and prevent invalid values.

#### Scenario: Counter prevents negative values
- **WHEN** the decrement button is tapped when the count is 0
- **THEN** the count remains at 0 and no further decrement is allowed

#### Scenario: Counter accepts numeric input
- **WHEN** a valid numeric value is entered in the input field
- **THEN** the counter updates to display the new value

#### Scenario: Counter rejects non-numeric input
- **WHEN** a non-numeric character is entered in the input field
- **THEN** the input is rejected and the field displays an error state
