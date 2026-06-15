# MVP Implementation Plan - Team Scoring Platform

This implementation plan defines the scope and tasks required to launch the MVP of the H.E.R.O platform, focusing exclusively on team competitions, live leaderboard projection, and a simplified admin flow.

## User Review Required

> [!SECURITY]
> **Row Level Security (RLS) Warning:**
> The `public.team_members` table currently has Row Level Security (RLS) disabled. Anyone with the anon key can read or modify every row.
> We propose enabling RLS and adding basic policies (e.g., read-only for public/authenticated, write-only for admins).
> ```sql
> ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
> CREATE POLICY "Allow public read-only access to team_members" ON public.team_members FOR SELECT USING (true);
> CREATE POLICY "Allow admin full access to team_members" ON public.team_members TO authenticated USING (is_admin());
> ```

> [!IMPORTANT]
> **Supabase `scores` Schema Constraint:**
> In the Supabase database schema, the `athlete_id` column in the `scores` table is currently marked as **NOT NULL** (required).
> For team scoring, we need to decide how to handle this:
> 1. Make `athlete_id` nullable in Supabase by running a migration.
> 2. Or, populate `athlete_id` with the ID of one of the team members (e.g., the captain or the first athlete returned in the heat team query).
> *We recommend Option 1 (making it nullable) for cleaner database integrity.*

---

## Proposed Changes

We will organize the MVP development into four main areas:
1. Database Schema & RLS Polish
2. Judge App (`apps/judge` & `@hero/heat`, `@hero/score` libs) - Team Only
3. Live Leaderboard App (`apps/leaderboard`) - Astro Realtime TV View
4. Admin App (`apps/admin`) - Event, Team, WOD & Heat Flow management

---

### 1. Database Schema & RLS Polish
Refine database constraints and secure team tables.

#### [MODIFY] Supabase Migrations / DB Setup
- Apply migration to make `scores.athlete_id` nullable (if approved).
- Enable RLS on `public.team_members` and add appropriate policies.

---

### 2. Judge App (`apps/judge` / `@hero/heat` & `@hero/score` libs)
Focus exclusively on team selection and team scoring flow.

#### [MODIFY] [heat-confirmation.page.ts](file:///d:/hero/libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts)
- Force `activeTab` to `'teams'` and remove the tab switcher UI (since we are focusing only on team events for the MVP).
- Render team names, bib numbers, and their members grouped cleanly.

#### [MODIFY] [register-repetitions.page.ts](file:///d:/hero/libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.ts)
- Ensure the scoring panel fits team requirements. If a team WOD requires inputting reps per athlete (e.g. member 1 did X reps, member 2 did Y reps), implement the `team-member-inputs` component to aggregate them.
- If it's a simple total score for the team, use the main numeric keypad directly and associate the final score with the `team_id`.

#### [MODIFY] [summary.page.ts](file:///d:/hero/libs/contexts/score/src/feature/pages/summary/summary.page.ts)
- Display the team name and bib number prominently.
- Implement the signature component for the team representative/captain to sign off.
- Use `RegisterRepetitionsFacade.finalizeScore()` to submit the score to Supabase.

---

### 3. Live Leaderboard App (`apps/leaderboard`)
A static Astro page combined with React/Preact islands that connects to Supabase Realtime to show live standings of teams by event code.

#### [NEW] [[eventCode].astro](file:///d:/hero/apps/leaderboard/src/pages/leaderboard/[eventCode].astro)
- Add a new dynamic route `/leaderboard/[eventCode]` in Astro.
- Fetch initial event, categories, levels, and scores from Supabase on the server side.
- Set up the static shell layout (Score Design system - dark background `#0f172a`, emerald-600 accents).

#### [NEW] [LeaderboardTable.tsx](file:///d:/hero/apps/leaderboard/src/components/LeaderboardTable.tsx)
- Create a React/Preact component with Supabase Realtime subscription to `scores` table.
- Subscribe to real-time changes filtered by the event's WODs.
- Implement sorting/ranking algorithm client-side based on `scoring_direction` (higher is better for AMRAP, lower is better for For Time).
- Display standings with medals (🥇🥈🥉) for the top 3 and position change indicators (↑↓).

#### [NEW] [WodTabs.tsx](file:///d:/hero/apps/leaderboard/src/components/WodTabs.tsx)
- Tab switcher to toggle between different WODs of the event.

---

### 4. Admin Panel App (`apps/admin`)
A desktop-first Angular app to manage the event cycle.

#### [NEW] [event-management](file:///d:/hero/apps/admin/src/app/features/events/)
- **Event Creator:** A wizard or simple form to define name, date, location, sport type (Crossfit/Hyrox), and ranking method.

#### [NEW] [team-management](file:///d:/hero/apps/admin/src/app/features/teams/)
- **Team Creator/List:** Add teams, select their category/level, specify their bib number, and manage their roster (`team_members` rows).

#### [NEW] [wod-management](file:///d:/hero/apps/admin/src/app/features/wods/)
- **WOD Creator:** Define WOD details, scoring type (AMRAP, For Time), and the "Flow" (movements list, order, target reps) to write into `base_config.movements`.

#### [NEW] [heat-management](file:///d:/hero/apps/admin/src/app/features/heats/)
- **Heat Builder:** Form to create Heats for a specific WOD, assign teams to lanes (`heat_athletes`), and assign a judge profile to each lane.
- **Heat Controller:** Start and finish heats (updates `heats.status` and sets `started_at`/`finished_at` to trigger timers).

#### [NEW] [score-validation](file:///d:/hero/apps/admin/src/app/features/scores/)
- **Score Review:** A table monitoring scores submitted by judges. Enables the admin to confirm scores (`submitted -> confirmed`) or flag them as disputed.

---

## Verification Plan

### Automated Tests
We will verify components and domain logic with Vitest:
- Run judge unit tests: `npx nx test judge`
- Run core context tests: `npx nx test contexts-heat` and `npx nx test contexts-score`
- Run leaderboard/admin tests if applicable.

### Manual Verification
1. **Admin Setup:** Create an event, add 3 teams, define a WOD with 2 movements, create a Heat, and assign the teams.
2. **Judge Scoring:** Load the judge app using the heat name, identify as a judge, select a team, input reps, sign, and submit. Check that it updates `scores` with `team_id` in Supabase.
3. **Realtime Leaderboard:** Open the `/leaderboard/[eventCode]` page on a separate screen. Verify that the score appears instantly (<200ms) upon judge submission.
4. **Admin Confirmation:** Access the admin dashboard, locate the submitted score, and confirm it.
