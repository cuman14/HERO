## 1. Configuration Update

- [x] 1.1 Add budgets configuration to apps/judge/project.json under targets.build.configurations.production
- [x] 1.2 Verify the JSON syntax is valid

## 2. Build Verification

- [x] 2.1 Run `npx nx build judge --configuration=production` to verify build passes budgets
- [x] 2.2 If build fails due to budget limits, analyze bundle sizes and adjust thresholds if needed

## 3. Quality Checks

- [x] 3.1 Run `npx nx lint judge` to ensure no linting issues
- [x] 3.2 Run `npx nx test judge` to ensure all tests pass