## Context

The judge app is a mobile-first PWA for offline score entry during CrossFit/Hyrox competitions. Production builds currently bundle all vendor dependencies into a single chunk, resulting in large initial JavaScript payloads that impact mobile performance.

## Goals / Non-Goals

**Goals:**
- Configure Vite/Rollup `manualChunks` to split vendor dependencies into named chunks
- Create separate chunks for: supabase, rxjs, ngrx, and a catch-all vendor chunk
- Maintain existing build functionality and output structure

**Non-Goals:**
- Modify any other app's build configuration (admin, leaderboard)
- Change chunk naming strategy beyond what's specified
- Implement dynamic imports or code splitting beyond vendor chunks

## Decisions

**Decision: Use function-based manualChunks configuration**
- Rationale: Function form allows pattern matching on module IDs for flexible grouping
- Alternative considered: Static object mapping — rejected because it requires explicit listing of every package

**Decision: Chunk naming strategy**
- `supabase` — matches `@supabase/*` and `supabase` packages
- `rxjs` — matches `rxjs` package
- `ngrx` — matches `@ngrx/*` packages (including `@ngrx/signals`)
- `vendor` — catch-all for all other `node_modules` dependencies

**Decision: Apply only to judge app**
- Rationale: Task specifically targets `apps/judge/vite.config.mts`
- Other apps can adopt similar configuration independently if needed

## Risks / Trade-offs

- [Risk] Incorrect regex patterns could mis-group dependencies → Mitigation: Test build output and verify chunk contents
- [Risk] Too many small chunks could increase HTTP requests → Mitigation: Current 4-chunk strategy balances granularity with request count
- [Risk] Cache invalidation if chunk hashes change unexpectedly → Mitigation: Vendor chunks are stable; only app code chunk changes frequently