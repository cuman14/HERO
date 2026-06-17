## ADDED Requirements

### Requirement: Judge name is displayed in heat confirmation footer

The heat confirmation page SHALL display the assigned judge's name in a sticky footer. The judge name MUST be fetched from the `profiles` table using the `judgeId` passed to the repository.

#### Scenario: Judge name shown in footer

- **GIVEN** a judge has entered their name on the heat access page
- **AND** the `judgeId` is passed to the heat confirmation repository
- **WHEN** the heat confirmation page loads
- **THEN** the `profiles` table is queried for the judge's `display_name`
- **AND** the footer displays `"Juez: {display_name}"`

#### Scenario: Judge profile not found

- **GIVEN** the `judgeId` does not match any profile in the database
- **WHEN** the heat confirmation page loads
- **THEN** the footer displays no judge name
- **AND** no error is shown to the user

#### Scenario: Judge ID is empty

- **GIVEN** no `judgeId` is provided
- **WHEN** the heat confirmation page loads
- **THEN** the footer displays no judge name
- **AND** no error is shown to the user
