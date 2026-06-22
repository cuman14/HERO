## Why

The judge app's production bundle currently includes all vendor dependencies in a single chunk, leading to large initial download sizes. Configuring `manualChunks` in Vite's Rollup output will split vendor code into separate chunks (supabase, rxjs, ngrx, vendor), enabling better caching and parallel loading for the mobile-first PWA.

## What Changes

- Add `build.rollupOptions.output.manualChunks` configuration to `apps/judge/vite.config.mts`
- Split vendor dependencies into named chunks:
  - `@supabase` / `supabase` → `supabase` chunk
  - `rxjs` → `rxjs` chunk
  - `@ngrx/signals` / `@ngrx` → `ngrx` chunk
  - All other `node_modules` → `vendor` chunk

## Capabilities

### New Capabilities
- `vendor-chunk-splitting`: Configure manual chunk splitting for judge app production builds

### Modified Capabilities
- None

## Impact

- **Files modified**: `apps/judge/vite.config.mts`
- **Build output**: Production builds will generate separate chunk files for each vendor group
- **Caching**: Improved browser caching as vendor chunks change less frequently than app code
- **Performance**: Reduced initial bundle size, better parallel loading on mobile