## ADDED Requirements

### Requirement: Score summary is displayed after all movements are recorded
The system SHALL automatically navigate to the score summary screen when the judge confirms the last movement repetition in the scoring screen.

#### Scenario: Auto-navigation to summary on last movement confirmation
- **GIVEN** the judge is on the scoring screen
  AND the current movement is the last movement in the WOD (`!canNavigateNext`)
- **WHEN** the judge taps the confirm button
- **THEN** the system stores the elapsed time in the facade
  AND navigates to `/scoring/:heatAthleteId/summary`

#### Scenario: Summary screen displays athlete context
- **GIVEN** the judge has been navigated to the summary screen
- **WHEN** the screen renders
- **THEN** the athlete's name, bib number, division, lane number, heat name, WOD name, and WOD type are displayed

#### Scenario: Summary screen displays movement breakdown
- **GIVEN** the judge has been navigated to the summary screen
- **WHEN** the screen renders
- **THEN** each movement is listed with its round label, name, confirmed repetition count, and target repetition count

#### Scenario: Summary screen displays total repetitions
- **GIVEN** the judge has been navigated to the summary screen
- **WHEN** the screen renders
- **THEN** the total repetition count across all movements is displayed

#### Scenario: Summary screen displays elapsed time
- **GIVEN** the judge has been navigated to the summary screen
- **WHEN** the screen renders
- **THEN** the elapsed time from the scoring session is displayed in MM:SS format

### Requirement: Judge can confirm and submit the final score
The system SHALL allow the judge to submit the final score from the summary screen, transitioning the score status from `draft` to `submitted`.

#### Scenario: Judge submits the final score successfully
- **GIVEN** the judge is on the summary screen
  AND the score status is `draft`
- **WHEN** the judge taps "Confirm & Submit"
- **THEN** the system sets the score status to `submitted` in the database
  AND navigates to `/heat-confirmation`

#### Scenario: Submit button shows loading state during submission
- **GIVEN** the judge has tapped "Confirm & Submit"
- **WHEN** the submission is in progress
- **THEN** the button is disabled and shows a loading indicator

#### Scenario: Submission failure shows error and allows retry
- **GIVEN** the judge has tapped "Confirm & Submit"
- **WHEN** the Supabase update fails
- **THEN** an error message is shown on screen
  AND the "Confirm & Submit" button is re-enabled for retry

### Requirement: Summary screen redirects if store is empty
The system SHALL redirect the judge to the heat access screen if the summary page is accessed without valid store state.

#### Scenario: Direct URL access with empty store
- **GIVEN** the judge navigates directly to `/scoring/:heatAthleteId/summary`
  AND the `athleteHeat` in the store is null
- **WHEN** the screen initializes
- **THEN** the system redirects to `/heat-access`
