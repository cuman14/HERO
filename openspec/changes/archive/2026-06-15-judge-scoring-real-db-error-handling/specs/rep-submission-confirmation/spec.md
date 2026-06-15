## MODIFIED Requirements

### Requirement: Submission Flow
Judges must be able to submit repetition counts to the real database with clear confirmation and feedback.

#### Scenario: Judge submits repetition count
- **WHEN** judge taps the submit button after entering a repetition count
- **THEN** the repetition count is persisted to the Supabase `repetition_records` table

#### Scenario: Submission is confirmed
- **WHEN** the server successfully saves the repetition count
- **THEN** the UI advances to the next movement, or to the summary screen when the last movement is confirmed

#### Scenario: Submission fails due to unexpected server error
- **WHEN** the server fails to save the repetition count with an HTTP 500 or unknown error
- **THEN** the generic error modal is displayed with a retry option

#### Scenario: Submission fails due to business error
- **WHEN** the server rejects the repetition count with a business error code `H00{n}`
- **THEN** the error is displayed with its code and registered message

#### Scenario: Submission fails due to validation error
- **WHEN** the server rejects the repetition count due to validation rules
- **THEN** an error message is displayed explaining the validation failure and suggesting corrective action
