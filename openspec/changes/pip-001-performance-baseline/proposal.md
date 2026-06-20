## Why

Establish performance baselines for the judge app before implementing optimizations. Without measurable metrics, we cannot verify improvements or detect regressions. The demo deadline (2026-04-11) requires confidence that the PWA meets performance thresholds on mobile devices.

## What Changes

- Add `@lhci/cli` as a dev dependency for local and CI Lighthouse runs
- Create `lighthouserc.json` at repo root with assertions for Core Web Vitals (FCP, LCP, TBT, CLS)
- Create GitHub Actions workflow `.github/workflows/perf-judge.yml` to run LHCI on every PR
- Add `vite-bundle-visualizer` for manual bundle analysis
- Configure LHCI to test the production build of the judge app

## Capabilities

### New Capabilities

- `performance-baseline`: Automated Lighthouse CI integration for the judge app with assertions on Core Web Vitals
- `bundle-analysis`: Manual bundle size visualization via vite-bundle-visualizer

### Modified Capabilities

- None

## Impact

- **Files added**: `lighthouserc.json`, `.github/workflows/perf-judge.yml`
- **Dependencies added**: `@lhci/cli`, `vite-bundle-visualizer` (devDependencies)
- **CI/CD**: New GitHub Actions workflow running on every PR
- **Apps affected**: `apps/judge` (primary), build configuration
- **No runtime changes** - this is dev/CI tooling only