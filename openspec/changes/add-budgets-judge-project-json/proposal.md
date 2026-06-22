## Why

The judge app (Angular PWA) currently lacks bundle size budgets in its production build configuration. Adding budgets ensures the mobile-first PWA stays within performance targets, preventing accidental bundle bloat that would degrade offline-first experience on mobile devices.

## What Changes

- Add `budgets` configuration to `apps/judge/project.json` under `targets.build.configurations.production`
- Two budget entries following the admin app pattern:
  - `initial`: maximumWarning 500kb, maximumError 1mb
  - `anyComponentStyle`: maximumWarning 2kb, maximumError 4kb

## Capabilities

### New Capabilities
- `build-budgets-judge`: Bundle size budgets for judge app production builds

### Modified Capabilities
- None

## Impact

- **Files modified**: `apps/judge/project.json`
- **Build verification**: `npx nx build judge --configuration=production` must pass budgets
- **No API changes**, no database changes, no runtime behavior changes
- **Dependencies**: None