## Purpose

Provide developers with tools to analyze bundle size composition of H.E.R.O applications, enabling identification of large dependencies and optimization opportunities.

## ADDED Requirements

### Requirement: Manual Bundle Size Visualization
The system SHALL provide a manual command for developers to analyze bundle size composition of the judge application.

#### Scenario: Developer runs bundle visualizer
- **WHEN** developer executes `nx build judge --configuration=production && npx vite-bundle-visualizer dist/apps/judge`
- **THEN** production build of judge app is created
- **THEN** vite-bundle-visualizer generates an interactive treemap report
- **THEN** report opens in browser showing module sizes and dependencies
- **THEN** developer can identify large dependencies and optimization opportunities

### Requirement: Bundle Analysis Available for All Apps
The system SHALL support bundle analysis for admin and leaderboard applications in addition to judge.

#### Scenario: Bundle analysis for admin app
- **WHEN** developer executes `nx build admin --configuration=production && npx vite-bundle-visualizer dist/apps/admin`
- **THEN** production build of admin app is created
- **THEN** vite-bundle-visualizer generates report for admin app

#### Scenario: Bundle analysis for leaderboard app
- **WHEN** developer executes `nx build leaderboard --configuration=production && npx vite-bundle-visualizer dist/leaderboard`
- **THEN** production build of leaderboard app is created
- **THEN** vite-bundle-visualizer generates report for leaderboard app
