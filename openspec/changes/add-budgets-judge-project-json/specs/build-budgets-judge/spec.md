## ADDED Requirements

### Requirement: Production build enforces bundle size budgets
The judge application production build SHALL enforce bundle size budgets to prevent bundle bloat.

#### Scenario: Initial bundle budget check passes
- **WHEN** running `nx build judge --configuration=production`
- **THEN** build succeeds if initial bundle size is ≤ 500kb (warning) or ≤ 1mb (error)

#### Scenario: Initial bundle budget warning triggers
- **WHEN** running `nx build judge --configuration=production` and initial bundle size exceeds 500kb
- **THEN** build succeeds with warning message indicating initial bundle exceeds 500kb

#### Scenario: Initial bundle budget error triggers
- **WHEN** running `nx build judge --configuration=production` and initial bundle size exceeds 1mb
- **THEN** build fails with error message indicating initial bundle exceeds 1mb

#### Scenario: Any component style budget check passes
- **WHEN** running `nx build judge --configuration=production`
- **THEN** build succeeds if all component styles are ≤ 2kb (warning) or ≤ 4kb (error)

#### Scenario: Any component style budget warning triggers
- **WHEN** running `nx build judge --configuration=production` and any component style exceeds 2kb
- **THEN** build succeeds with warning message indicating component style exceeds 2kb

#### Scenario: Any component style budget error triggers
- **WHEN** running `nx build judge --configuration=production` and any component style exceeds 4kb
- **THEN** build fails with error message indicating component style exceeds 4kb