## ADDED Requirements

### Requirement: Accordion displays all completed movements
The MovementStackCard component SHALL provide an accordion section that displays all completed movements when expanded.

#### Scenario: Accordion header visible when completed items exist
- **WHEN** the component receives items with at least one completed status
- **THEN** an accordion header with label "COMPLETADOS (N)" is rendered where N is the count of completed items

#### Scenario: Accordion header hidden when no completed items
- **WHEN** the component receives items with zero completed status
- **THEN** no accordion header is rendered and the stacked cards area is not shown

### Requirement: Accordion expands and collapses on header click
The accordion SHALL toggle between expanded and collapsed states when the header is clicked.

#### Scenario: Expand on header click when collapsed
- **WHEN** the accordion is in collapsed state and the user clicks the header area
- **THEN** the accordion transitions to expanded state showing the full list of completed movements

#### Scenario: Collapse on header click when expanded
- **WHEN** the accordion is in expanded state and the user clicks the header area
- **THEN** the accordion transitions to collapsed state hiding the list

#### Scenario: Chevron icon rotates to indicate state
- **WHEN** the accordion toggles between expanded and collapsed
- **THEN** the chevron icon rotates 180 degrees with smooth transition

### Requirement: Expanded accordion shows complete list of completed movements
When expanded, the accordion SHALL display a vertical list of all completed movements with their details.

#### Scenario: List shows all completed movements in order
- **WHEN** the accordion is expanded
- **THEN** all completed movements are listed in chronological order (oldest first) with each row showing:
  - Checkmark icon indicating completed status
  - Movement name
  - Repetition count as "currentReps/targetReps reps"
  - Round label

#### Scenario: List updates reactively when new movement completed
- **WHEN** a new movement is completed and added to completedItems while accordion is expanded
- **THEN** the list automatically updates to include the new movement without collapsing

### Requirement: Collapsed state preserves current stacked card visual
When collapsed, the component SHALL display the existing stacked card visual for up to 2 most recent completed movements.

#### Scenario: Stacked cards shown when collapsed
- **WHEN** the accordion is collapsed and there are 1-2 completed movements
- **THEN** the stacked cards (card -1 and card -2) are rendered with current animations

#### Scenario: No stacked cards shown when expanded
- **WHEN** the accordion is expanded
- **THEN** the stacked cards are hidden and only the vertical list is visible

### Requirement: Smooth expand/collapse animation
The accordion SHALL animate height and opacity transitions smoothly.

#### Scenario: Expand animation
- **WHEN** accordion transitions from collapsed to expanded
- **THEN** the list container animates max-height from 0 to full height and opacity from 0 to 1 over 300ms ease-out

#### Scenario: Collapse animation
- **WHEN** accordion transitions from expanded to collapsed
- **THEN** the list container animates max-height from full height to 0 and opacity from 1 to 0 over 300ms ease-out

### Requirement: Accordion header meets accessibility requirements
The accordion header SHALL be accessible via keyboard and screen readers.

#### Scenario: Header is keyboard focusable and operable
- **WHEN** user navigates with keyboard to the accordion header
- **THEN** the header receives focus and can be activated with Enter/Space

#### Scenario: Header has proper ARIA attributes
- **WHEN** the accordion header is rendered
- **THEN** it has aria-expanded="true/false", aria-controls pointing to the list container, and role="button"