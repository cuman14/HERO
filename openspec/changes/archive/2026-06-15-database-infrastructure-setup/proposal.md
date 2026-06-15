## Why

The H.E.R.O platform has no formal database migration workflow, no configured Realtime publication, and no indexes on critical query paths. The `scores.athlete_id` column still requires a value despite the schema supporting team-based scoring where athletes may not exist individually. The Supabase CLI access token is not configured, blocking CLI-based operations. As the MVP demo approaches, these gaps prevent reliable deployments and live leaderboard updates.

## What Changes

- **Migration workflow**: Initialize a `supabase/migrations/` directory with the first formal migration (`ALTER TABLE scores ALTER COLUMN athlete_id DROP NOT NULL`).
- **Realtime**: Add `scores` table to the `supabase_realtime` publication so the leaderboard receives live score updates.
- **Database indexes**: Create `scores(heat_id, status)` and an index for `event_code` searches.
- **Environment**: Configure `SUPABASE_ACCESS_TOKEN` for CLI-based operations.
- **Types**: Regenerate `libs/types/src/database.types.ts` to reflect the current schema.
- **RLS differs**: Security policies (RLS) are out of scope for this change. They will be addressed in a future change alongside authentication.

## Capabilities

No new capabilities or spec-level requirements changes. This is an infrastructure-only change.

## Impact

- `supabase/migrations/` — new directory with migration files.
- `libs/types/src/database.types.ts` — regenerated to match current schema.
- `.env` — `SUPABASE_ACCESS_TOKEN` added.
- `scores` table — `athlete_id` becomes nullable, realtime publication configured, new indexes.
