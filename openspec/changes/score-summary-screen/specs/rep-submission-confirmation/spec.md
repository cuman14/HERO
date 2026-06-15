## MODIFIED Requirements

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

#### Scenario: Last movement confirmed — navigate to summary
- **WHEN** the judge confirms the repetition count for the last movement (`!canNavigateNext`)
- **THEN** the system records the elapsed time in the store
  AND navigates to `/scoring/:heatAthleteId/summary` instead of staying on the scoring screen
