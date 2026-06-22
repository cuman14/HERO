## ADDED Requirements

### Requirement: Vendor chunk splitting configuration
The judge app build system SHALL configure Vite's Rollup output to split vendor dependencies into named chunks using manualChunks.

#### Scenario: Production build generates separate vendor chunks
- **WHEN** running `npx nx build judge --configuration=production`
- **THEN** the output directory contains separate chunk files for supabase, rxjs, ngrx, and vendor

### Requirement: Supabase dependencies grouped in supabase chunk
All modules matching `@supabase/*` or `supabase` package names SHALL be bundled into a single chunk named `supabase`.

#### Scenario: Supabase modules appear in supabase chunk
- **WHEN** analyzing production build output
- **THEN** `@supabase/supabase-js` and related packages are in `supabase-[hash].js` chunk

### Requirement: RxJS dependencies grouped in rxjs chunk
All modules matching `rxjs` package name SHALL be bundled into a single chunk named `rxjs`.

#### Scenario: RxJS modules appear in rxjs chunk
- **WHEN** analyzing production build output
- **THEN** `rxjs` and `rxjs/*` packages are in `rxjs-[hash].js` chunk

### Requirement: NgRx dependencies grouped in ngrx chunk
All modules matching `@ngrx/*` package names SHALL be bundled into a single chunk named `ngrx`.

#### Scenario: NgRx modules appear in ngrx chunk
- **WHEN** analyzing production build output
- **THEN** `@ngrx/signals` and other `@ngrx/*` packages are in `ngrx-[hash].js` chunk

### Requirement: Remaining vendor dependencies grouped in vendor chunk
All other modules from `node_modules` not matched by above rules SHALL be bundled into a single chunk named `vendor`.

#### Scenario: Other vendor modules appear in vendor chunk
- **WHEN** analyzing production build output
- **THEN** Angular, Tailwind, and other dependencies are in `vendor-[hash].js` chunk