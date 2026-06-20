## ADDED Requirements

### Requirement: Automated Lighthouse CI on Pull Requests
The system SHALL run Lighthouse CI automatically on every pull request targeting the main branch for the judge application production build.

#### Scenario: PR triggers LHCI workflow
- **WHEN** a pull request is opened or updated against main branch
- **THEN** GitHub Actions workflow `perf-judge` executes
- **THEN** workflow builds judge app in production configuration
- **THEN** workflow runs Lighthouse CI against the built application
- **THEN** workflow posts results as a comment on the PR

### Requirement: Core Web Vitals Assertions
The system SHALL enforce assertions on Core Web Vitals metrics with defined thresholds.

#### Scenario: First Contentful Paint warning threshold
- **WHEN** LHCI measures First Contentful Paint (FCP)
- **THEN** FCP SHALL be less than 2000ms (warning threshold)
- **THEN** LHCI SHALL report warning if FCP exceeds 2000ms

#### Scenario: Largest Contentful Paint error threshold
- **WHEN** LHCI measures Largest Contentful Paint (LCP)
- **THEN** LCP SHALL be less than 3000ms (error threshold)
- **THEN** LHCI SHALL fail the build if LCP exceeds 3000ms

#### Scenario: Total Blocking Time warning threshold
- **WHEN** LHCI measures Total Blocking Time (TBT)
- **THEN** TBT SHALL be less than 300ms (warning threshold)
- **THEN** LHCI SHALL report warning if TBT exceeds 300ms

#### Scenario: Cumulative Layout Shift error threshold
- **WHEN** LHCI measures Cumulative Layout Shift (CLS)
- **THEN** CLS SHALL be less than 0.1 (error threshold)
- **THEN** LHCI SHALL fail the build if CLS exceeds 0.1

### Requirement: Local Baseline Measurement
The system SHALL provide a local command for developers to measure performance baseline before pushing changes.

#### Scenario: Developer runs local baseline
- **WHEN** developer executes `nx build judge --configuration=production && lhci autorun`
- **THEN** production build of judge app is created
- **THEN** LHCI runs Lighthouse against the local build
- **THEN** results are displayed in terminal with assertions evaluation

### Requirement: Mobile Emulation Configuration
The system SHALL configure LHCI to use mobile device emulation matching target hardware.

#### Scenario: LHCI uses mobile emulation
- **WHEN** LHCI runs (local or CI)
- **THEN** Chrome emulates a mobile device (Moto G4 or equivalent)
- **THEN** network throttling simulates 4G (Fast 3G as fallback)
- **THEN** CPU throttling simulates mobile processor (4x slowdown)