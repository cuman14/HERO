## Context

The judge app is an Angular 21 PWA targeting mobile devices for offline-first competition scoring. Before implementing performance optimizations, we need automated measurement to establish baselines and prevent regressions. The demo deadline (2026-04-11) requires confidence that Core Web Vitals meet thresholds on mobile hardware.

Current state: No performance measurement in CI. Local Lighthouse runs are manual and inconsistent.

## Goals / Non-Goals

**Goals:**
- Automated Lighthouse CI runs on every PR for the judge app production build
- Assertions on Core Web Vitals: FCP, LCP, TBT, CLS
- Local baseline measurement capability for developers
- Bundle size visualization for manual analysis
- Zero runtime impact - dev/CI tooling only

**Non-Goals:**
- Custom dashboards or Chart.js visualizations
- SaaS metrics platforms (SpeedCurve, Calibre, etc.)
- Performance budgets for admin or leaderboard apps (future work)
- Real-user monitoring (RUM) - out of scope for PIP-001

## Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| `@lhci/cli` over Lighthouse CI GitHub Action | Single tool for local + CI, consistent config, simpler maintenance | `lighthouse-ci-action` (separate local/CI config), `web-vitals` library (no CI integration) |
| Assertions in `lighthouserc.json` (not workflow) | Single source of truth, version-controlled, portable | Inline in workflow YAML (duplication, harder to test locally) |
| Test judge app only (not admin/leaderboard) | Judge is mobile PWA with strictest constraints; admin/leaderboard are desktop/TV | Test all three apps (slower CI, noise from non-mobile targets) |
| `vite-bundle-visualizer` for bundle analysis | Zero-config, works with Vite, outputs interactive HTML | `webpack-bundle-analyzer` (not Vite-native), `rollup-plugin-visualizer` (extra config) |
| LHCI server mode (not autorun) in CI | Better control, artifact upload, PR comments | `lhci autorun` (simpler but less control) |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| LHCI flakiness on CI runners (resource constraints) | Use `--collect.settings.headless=true`, `--collect.settings.chromeFlags="--no-sandbox --disable-dev-shm-usage"`, retry logic in workflow |
| Mobile emulation not matching real devices | Assertions set with mobile-friendly thresholds (FCP warn>2s, LCP error>3s, TBT warn>300ms, CLS error>0.1); real-device testing remains manual |
| CI time increase | LHCI runs only on judge app (~3-5 min); parallelize with other jobs |
| Bundle visualizer adds build time | Only runs on demand via `nx run judge:bundle-report`, not in CI |

## Migration Plan

1. Add devDependencies: `@lhci/cli`, `vite-bundle-visualizer`
2. Create `lighthouserc.json` at repo root
3. Create `.github/workflows/perf-judge.yml`
4. Test locally: `nx build judge --configuration=production && lhci autorun`
5. Push to trigger CI workflow
6. Verify PR comments with LHCI results appear

Rollback: Remove workflow file and devDependencies - no runtime code changes.

## Open Questions

- Should we add a `performance` npm script to `package.json` for convenience?
- Do we need separate budgets for desktop vs mobile emulation? (Start with mobile only)