## ADDED Requirements

### Requirement: Business Error Code Registry
The judge app SHALL maintain a centralized registry of business error codes formatted as `H00{n}`, where `{n}` is a sequential number, and each code maps to a human-readable message.

#### Scenario: Error code is registered
- **WHEN** a developer adds a new business error code `H001` with message "Heat assignment not found"
- **THEN** the registry contains the code and returns its message on lookup

#### Scenario: Error code is looked up at runtime
- **WHEN** the system encounters business error `H001`
- **THEN** the registry returns the message "Heat assignment not found"

#### Scenario: Unknown business code falls back gracefully
- **WHEN** the system encounters a business code that is not registered
- **THEN** the registry returns a default fallback message and logs the missing code

### Requirement: Generic Unexpected Error Modal
The judge app SHALL display a modal dialog for unexpected server errors (HTTP 500) or failures that do not map to a known business error code.

#### Scenario: Server returns HTTP 500
- **WHEN** an API call fails with an HTTP 500 or equivalent unexpected server error
- **THEN** a modal is displayed with the generic message and a primary action to retry or dismiss

#### Scenario: Unknown error type occurs
- **WHEN** an operation throws an error that is neither a business error nor an HTTP 500
- **THEN** the generic error modal is displayed with the generic message

#### Scenario: Modal can be dismissed
- **WHEN** the generic error modal is displayed and the judge taps the dismiss action
- **THEN** the modal closes and the app returns to the previous state

### Requirement: Business Error Display
Business errors SHALL be displayed with their `H00{n}` code and the specific message from the registry.

#### Scenario: Business error occurs during scoring
- **WHEN** a business rule violation produces error `H002`
- **THEN** the UI displays the text "H002: <registered message>"

#### Scenario: Business error occurs during final submission
- **WHEN** `finalizeScore` fails with business error `H003`
- **THEN** the summary screen displays the code and message and keeps the submit button enabled for retry
