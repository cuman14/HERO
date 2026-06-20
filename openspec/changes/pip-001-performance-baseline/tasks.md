## 1. Dependencies and Configuration

- [x] 1.1 Add @lhci/cli as devDependency to root package.json
- [x] 1.2 Add vite-bundle-visualizer as devDependency to root package.json
- [x] 1.3 Run pnpm install to install new dependencies

## 2. LHCI Configuration

- [x] 2.1 Create lighthouserc.json at repository root with assertions
- [x] 2.2 Configure mobile emulation (Moto G4, 4G throttling, 4x CPU slowdown)
- [x] 2.3 Configure CI server settings (headless, no-sandbox, disable-dev-shm-usage)
- [x] 2.4 Set collect.url to judge app production build output
- [x] 2.5 Define assertions: FCP warn>2000ms, LCP error>3000ms, TBT warn>300ms, CLS error>0.1

## 3. GitHub Actions Workflow

- [x] 3.1 Create .github/workflows/perf-judge.yml
- [x] 3.2 Configure workflow to trigger on pull_request to main
- [x] 3.3.3 Add job to build judge app: nx build judge --configuration=production
- [x] 3.4 Add job to run LHCI: lhci autorun --upload.target=temporary-public-storage
- [x] 3.5 Configure LHCI to post results as PR comment
- [x] 3.6 Set appropriate permissions for workflow (contents: read, pull-requests: write)

## 4. Local Development Scripts

- [x] 4.1 Add performance:baseline script to root package.json (nx build judge --configuration=production && lhci autorun)
- [x] 4.2 Add performance:bundle script to root package.json (nx build judge --configuration=production && npx vite-bundle-visualizer -c apps/judge/vite.config.mts)
- [x] 4.3 Verify local baseline command works end-to-end

## 5. Verification

- [ ] 5.1 Push changes to trigger CI workflow on a test PR (requires manual push)
- [ ] 5.2 Verify LHCI runs successfully in CI (requires manual push)
- [ ] 5.3 Verify PR comment with LHCI results appears (requires manual push)
- [ ] 5.4 Verify assertions pass/fail correctly based on current performance (requires manual push)
- [x] 5.5 Run local baseline and bundle analysis to confirm developer experience