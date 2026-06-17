## Context

The heat confirmation page (`HeatConfirmationPage`) has a hardcoded `judge = { id: '', name: '' }` object on line 176. The `judgeId` is already passed through the facade and repository but is only used to filter `heat_athletes` rows — it never fetches the judge's profile display name. The `profiles` table stores `display_name` for each user (including judges), and `heat_athletes.judge_id` references `profiles.id`.

## Goals / Non-Goals

**Goals:**
- Fetch the judge's display name from the `profiles` table using the existing `judgeId`
- Include judge info in `HeatConfirmationPayload` so the page component can read it
- Display `"Juez: [nombre]"` in the heat confirmation page footer

**Non-Goals:**
- Adding a `judge_id` column to the `heats` table (judge assignment is per heat_athlete)
- Implementing full auth/JWT login (still using anon key)
- Persisting judge name across page reloads (it comes from the profiles query each time)

## Decisions

1. **Add `judge` field to `HeatConfirmationPayload` rather than `HeatConfirmationHeat`** — the judge is a property of the confirmation session, not of the heat itself. This keeps `HeatConfirmationHeat` as a pure heat-domain model.
2. **Single Supabase query to `profiles`** — use `supabase.from('profiles').select('id,display_name').eq('id', judgeId).single()` called in parallel with the existing heat query via `combineLatest` or `forkJoin`.
3. **Display in footer template** — add a footer section to the heat confirmation template showing `"Juez: {judge.name}"`. The judge `id` is available for future use but only `name` is displayed.

## Risks / Trade-offs

- [Risk] If `judgeId` is undefined or the profile is not found, judge name will be empty. → Mitigation: keep the display conditional; show nothing if name is empty.
- [Risk] Extra database query per heat confirmation load. → Mitigation: this is a single `eq` lookup on a primary key, negligible overhead.
