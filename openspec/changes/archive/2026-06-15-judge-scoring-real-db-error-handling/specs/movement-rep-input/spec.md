## MODIFIED Requirements

### Requirement: Athlete and Movement Information Display
The screen must load the current athlete and movement information from a real heat assignment and display it clearly. Access without a valid `heatAthleteId` is not allowed.

#### Scenario: Athlete information is displayed for a valid heat assignment
- **WHEN** the register movement repetitions screen is loaded with a valid `heatAthleteId`
- **THEN** the current athlete's name, bib number, and division are displayed at the top of the screen

#### Scenario: Movement information is displayed for a valid heat assignment
- **WHEN** the register movement repetitions screen is loaded with a valid `heatAthleteId`
- **THEN** the current movement's name and description are displayed prominently

#### Scenario: Movement progress is indicated
- **WHEN** the judge is viewing the movement repetitions screen
- **THEN** a visual indicator shows the current movement's position in the sequence (e.g., "Movement 3 of 5")

#### Scenario: Missing heatAthleteId redirects to heat access
- **WHEN** the register movement repetitions screen is loaded without a `heatAthleteId`
- **THEN** the judge is redirected to `/heat-access`

#### Scenario: Invalid heatAthleteId displays an error
- **WHEN** the register movement repetitions screen is loaded with a `heatAthleteId` that does not exist
- **THEN** an error message is displayed and the judge can navigate back to `/heat-access`

#### Scenario: No movements configured for WOD shows fallback
- **WHEN** the register movement repetitions screen is loaded with a valid `heatAthleteId` but the WOD has no movements configured
- **THEN** the screen displays the message "No movements configured for this WOD" and the keypad and timer are hidden
