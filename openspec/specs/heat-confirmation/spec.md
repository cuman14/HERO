## Purpose

The heat confirmation page displays athletes grouped by category, with search and athlete card navigation. Only team athletes are shown — individual athletes are not accessible from this page.

## Requirements

### Requirement: Heat confirmation shows teams only
The heat confirmation page SHALL display only team athletes. The page MUST NOT provide a way to view individual athletes.

#### Scenario: Page loads with teams
- **GIVEN** a heat with both team and individual athletes
- **WHEN** the heat confirmation page loads
- **THEN** only team athletes are shown in the athlete list
- **AND** the page title shows the heat code
- **AND** the total athlete count reflects only team athletes

#### Scenario: No individual tab is shown
- **GIVEN** the heat confirmation page
- **WHEN** the page is rendered
- **THEN** no tab switcher or toggle for switching to individual view is present
- **AND** there is no way to navigate to an individual athlete view from this page

#### Scenario: Search filters team athletes
- **GIVEN** the heat confirmation page showing team athletes
- **WHEN** the user types a search query
- **THEN** the displayed team athletes are filtered by name or bib number

#### Scenario: Athlete card click navigates to score summary
- **GIVEN** the heat confirmation page showing team athletes
- **WHEN** the user clicks on a team athlete card
- **AND** the athlete has a score
- **THEN** the user is navigated to the scoring summary page with `readonly` mode

#### Scenario: Athlete card click navigates to heat confirmation summary
- **GIVEN** the heat confirmation page showing team athletes
- **WHEN** the user clicks on a team athlete card
- **AND** the athlete does NOT have a score
- **THEN** the user is navigated to the heat confirmation summary page with the heat code and athlete ID
