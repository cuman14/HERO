## ADDED Requirements

_No new requirements — this is a cleanup task with no functional changes._

## MODIFIED Requirements

_No existing requirements are modified._

## REMOVED Requirements

### Requirement: logo.png asset

The file `apps/judge/public/logo.png` (~192 KB, unused) is removed from the repository.

**Reason**: File is not referenced anywhere in the judge app codebase. `logo.svg` is the active logo asset.

**Migration**: No migration needed. If a PNG version is required in the future, generate it from `logo.svg`.
