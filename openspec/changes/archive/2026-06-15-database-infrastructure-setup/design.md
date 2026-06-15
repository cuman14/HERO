## Context

The H.E.R.O Supabase project exists with a manually-created schema (tables, a `leaderboard` view, helper functions `is_admin()` and `is_assigned_judge()`), but:

- No local migration workflow exists — the schema lives only in the Supabase dashboard.
- `scores.athlete_id` is `NOT NULL` (generated types confirm this: `athlete_id: string`), which conflicts with team-based scoring where athletes may be absent.
- The `scores` table is not in the `supabase_realtime` publication, so the leaderboard cannot receive live updates.
- No performance indexes exist on `scores(heat_id, status)` or for event-code lookups.
- `SUPABASE_ACCESS_TOKEN` is not configured, blocking CLI migrations and the Supabase MCP server.
- The generated TypeScript types (`libs/types/src/database.types.ts`) are potentially stale.

This change addresses all of the above infrastructure gaps.

## Goals / Non-Goals

**Goals:**
- Initialize a `supabase/migrations/` directory with the first formal migration.
- Apply `ALTER TABLE scores ALTER COLUMN athlete_id DROP NOT NULL`.
- Add `scores` table to `supabase_realtime` publication.
- Create indexes on `scores(heat_id, status)` and for event-code lookups.
- Configure `SUPABASE_ACCESS_TOKEN` in local environment.
- Regenerate `libs/types/src/database.types.ts`.
- Validate that the judge app still builds and tests pass after type regeneration.

**Non-Goals:**
- RLS policies or any authentication-related changes (deferred to future change).
- Adding new features or modifying application logic.
- Setting up seed data or dev data fixtures.
- Changes to the admin or leaderboard app code.

## Decisions

### 1. Init Supabase CLI locally instead of manual SQL

**Decision:** Run `npx supabase init` to create the `supabase/` directory, then `npx supabase migration new` to create the first migration file at `supabase/migrations/<timestamp>_make_athlete_id_nullable.sql`.

**Rationale:** A formal migration workflow ensures all schema changes are version-controlled, reviewable, and repeatable across environments. Manual SQL in the dashboard is the current state and has proven error-prone (the schema and types are already out of sync).

**Alternative considered:** Keep applying SQL manually. Rejected: no audit trail, no rollback, no CI integration.

### 2. Migration writes both DDL and publication change

**Decision:** A single migration file will contain:
1. `ALTER TABLE scores ALTER COLUMN athlete_id DROP NOT NULL`
2. `ALTER PUBLICATION supabase_realtime ADD TABLE scores`
3. `CREATE INDEX IF NOT EXISTS scores_heat_id_status_idx ON scores(heat_id, status)`
4. `CREATE INDEX IF NOT EXISTS scores_event_code_idx ON scores(heat_id, ...)` (TBD exact index definition)

**Rationale:** One migration = one deployable unit. Splitting them would require coordination between multiple migration runs.

### 3. Types regeneration after migration

**Decision:** Run `npx supabase gen types typescript --linked` (or `--project-id`) and overwrite `libs/types/src/database.types.ts`.

**Rationale:** The types must reflect the actual schema. Regenerating after the migration ensures `athlete_id` becomes `string | null` and any other schema changes are captured.

### 4. `SUPABASE_ACCESS_TOKEN` from environment

**Decision:** The developer must set `SUPABASE_ACCESS_TOKEN` in their local `.env` or shell profile. The token is obtained from the Supabase dashboard (Settings → API → Access Token).

**Rationale:** The token is required for `supabase link`, `supabase db push`, and the Supabase MCP server. It should not be committed to the repository.

## Risks / Trade-offs

- **[Risk] `SUPABASE_ACCESS_TOKEN` not available** → Mitigation: document the exact steps to create and configure the token. The MCP server will remain unauthorized until this is done.
- **[Risk] Regenerated types may break the build** → Mitigation: the type change `athlete_id: string → string | null` may require updating inline type definitions in the facade (`HeatAthleteContext.athlete_id`). Check and fix before committing.
- **[Risk] Realtime publication change affects existing subscriptions** → Mitigation: the existing subscription in `repetition-record.repository.supabase.ts` already targets `scores` table; adding it to the publication will only enable the events, not disrupt them.

## Migration Plan

1. Configure `SUPABASE_ACCESS_TOKEN` in local environment.
2. Run `npx supabase init` → creates `supabase/config.toml` and `supabase/migrations/`.
3. Link the local project to the remote: `npx supabase link --project-ref blgssvpsobfpfxghigca`.
4. Create and apply the migration.
5. Regenerate TypeScript types.
6. Fix any type mismatches in the facade.
7. Verify build: `npx nx build judge && npx nx test judge`.
8. Commit.

Rollback: Use `npx supabase migration repair` or manually revert each DDL statement in the Supabase dashboard SQL editor. The migration file itself serves as the rollback reference.
