## Purpose

Remove unused assets from the judge app to reduce bundle size and improve PWA performance.

## Requirements

### Requirement: Unused assets are removed

The system SHALL remove asset files that are not referenced anywhere in the codebase.

#### Scenario: logo.png is removed
- **WHEN** auditing the judge app assets
- **THEN** `apps/judge/public/logo.png` SHALL NOT exist in the repository
- **THEN** all logo references SHALL use `logo.svg` instead
