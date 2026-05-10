## ADDED Requirements

### Requirement: Submission Flow
Judges must be able to submit repetition counts with clear confirmation and feedback.

#### Scenario: Judge submits repetition count
- **WHEN** judge taps the submit button after entering a repetition count
- **THEN** the repetition count is sent to the server for persistence

#### Scenario: Submission is confirmed
- **WHEN** the server successfully saves the repetition count
- **THEN** a confirmation message is displayed to the judge

#### Scenario: Submission fails due to network error
- **WHEN** the server fails to save the repetition count due to a network error
- **THEN** an error message is displayed with options to retry or cancel

#### Scenario: Submission fails due to validation error
- **WHEN** the server rejects the repetition count due to validation rules
- **THEN** an error message is displayed explaining the validation failure and suggesting corrective action

### Requirement: Submission Button State
The submit button must reflect the current state of the form and prevent invalid submissions.

#### Scenario: Submit button is enabled when count is valid
- **WHEN** a valid repetition count has been entered
- **THEN** the submit button is enabled and ready to be tapped

#### Scenario: Submit button is disabled when no changes
- **WHEN** the repetition count has not been modified since the last submission
- **THEN** the submit button is disabled or shows a "no changes" state

#### Scenario: Submit button is disabled during submission
- **WHEN** the repetition count is being submitted to the server
- **THEN** the submit button is disabled and displays a loading indicator

### Requirement: Confirmation Dialog
A confirmation dialog may be displayed for certain submission scenarios.

#### Scenario: Confirmation dialog is shown for large changes
- **WHEN** judge attempts to submit a repetition count that differs significantly from the previous count
- **THEN** a confirmation dialog is displayed asking the judge to confirm the change

#### Scenario: Judge confirms submission
- **WHEN** the confirmation dialog is displayed and judge taps the confirm button
- **THEN** the repetition count is submitted to the server

#### Scenario: Judge cancels submission
- **WHEN** the confirmation dialog is displayed and judge taps the cancel button
- **THEN** the dialog is closed and the repetition count is not submitted
