## 1. Configure manualChunks in vite.config.mts

- [x] 1.1 Add build.rollupOptions.output.manualChunks function to apps/judge/vite.config.mts
- [x] 1.2 Implement chunk grouping logic for supabase, rxjs, ngrx, and vendor

## 2. Verify build and chunking

- [ ] 2.1 Run production build: npx nx build judge --configuration=production
- [ ] 2.2 Verify separate chunk files are generated (supabase, rxjs, ngrx, vendor)
- [ ] 2.3 Verify chunk contents match expected groupings

## 3. Run quality checks

- [ ] 3.1 Run lint: npx nx lint judge
- [ ] 3.2 Run tests: npx nx test judge