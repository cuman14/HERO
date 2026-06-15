## 1. Environment Setup

- [x] 1.1 Obtain `SUPABASE_ACCESS_TOKEN` from Supabase dashboard (Settings → API → Access Tokens) and configure it in local environment
- [x] 1.2 Verify Supabase CLI access: `npx supabase projects list` returns the project

## 2. Local Migration Workflow

- [x] 2.1 Initialize local Supabase project: `npx supabase init` creates `supabase/config.toml` and `supabase/migrations/`
- [x] 2.2 Link to remote project: `npx supabase link --project-ref blgssvpsobfpfxghigca`
- [x] 2.3 Pull the current remote schema: `npx supabase db pull` to capture existing state

## 3. Migration: Database Changes

- [x] 3.1 Create migration file: `npx supabase migration new make_athlete_id_nullable_add_indexes`
- [x] 3.2 Write migration SQL: `ALTER TABLE scores ALTER COLUMN athlete_id DROP NOT NULL` (already nullable in remote — no-op safe)
- [x] 3.3 Add `scores` table to `supabase_realtime` publication — already present in remote, migration skipped
- [x] 3.4 Create index `scores_heat_id_status_idx ON scores(heat_id, status)`
- [x] 3.5 Apply migration: `npx supabase db push`

## 4. TypeScript Types Regeneration

- [x] 4.1 Regenerate types: `npx supabase gen types typescript --linked > libs/types/src/database.types.ts`
- [x] 4.2 `scores.athlete_id` is now `string | null` ✓
- [x] 4.3 Additional changes: `heat_athletes.athlete_id` → `string | null`, `heat_athletes.id` added, new `graphql_public` schema

## 5. Code Alignment

- [x] 5.1 Inline types already used `string | null` — no changes needed
- [x] 5.2 Build passes: `npx nx build judge` ✓
- [x] 5.3 Tests pass: `npx nx test judge` ✓ (5/5)

## 6. Verification

- [x] 6.1 `scores` in `supabase_realtime` confirmed via schema dump (line 1130)
- [x] 6.2 `scores_heat_id_status_idx` created via migration push
- [ ] 6.3 Commit all changes to branch `feature/infra-database-infrastructure-setup`
