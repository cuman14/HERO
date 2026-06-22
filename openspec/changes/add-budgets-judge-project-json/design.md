## Context

The judge app is an Angular 21 PWA targeting mobile devices with offline-first capabilities. Currently, `apps/judge/project.json` has a minimal production configuration with only `mode: "production"`. The admin app (`apps/admin/project.json`) already includes bundle size budgets configuration that serves as the reference pattern.

## Goals / Non-Goals

**Goals:**
- Add bundle size budgets to judge app production build configuration
- Match the admin app pattern with judge-specific thresholds
- Ensure production build passes budget checks

**Non-Goals:**
- Modify development build configuration
- Change any source code or runtime behavior
- Add budgets for other apps (leaderboard, admin)

## Decisions

1. **Budget thresholds**: Use the exact values specified in the task (initial: 500kb/1mb, anyComponentStyle: 2kb/4kb) rather than copying admin's anyComponentStyle values (4kb/8kb). The judge app is a simpler mobile PWA with smaller component styles.

2. **Configuration location**: Add budgets under `targets.build.configurations.production` in `apps/judge/project.json`, following the exact same structure as admin.

3. **No spec file needed**: This is a configuration-only change with no new capabilities or modified requirements - it's a build-time guardrail.

## Risks / Trade-offs

- [Risk] Build fails due to exceeding budgets → Mitigation: Run build verification immediately after change; if budgets are too strict, adjust thresholds based on actual bundle sizes
- [Risk] Inconsistent thresholds between apps → Mitigation: Document that judge uses stricter anyComponentStyle (2kb vs 4kb) due to simpler mobile components