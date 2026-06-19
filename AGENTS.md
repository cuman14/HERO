# AGENTS.md

Guidance for AI coding agents working in this repo. Human docs live in `docs/`; this file is the source of truth when they disagree.

## Project

H.E.R.O — real-time scoring platform for CrossFit / Hyrox. Nx monorepo with 3 independent apps sharing a Supabase backend.

- **apps/admin** — Angular 21 (desktop)
- **apps/judge** — Angular 21 PWA (mobile)
- **apps/leaderboard** — Astro (TV/projector)
- **libs/** — `contexts` (heat, score), `core`, `types`, `ui`

App-specific guides (read on demand when working on that app):

- `apps/judge/AGENTS.md` — Judge Interface (detailed patterns)
- `docs/admin.md` — Admin Panel
- `docs/judge.md` — Judge Interface (product context)
- `docs/leaderboard.md` — Live Leaderboard

Design references:

- `DESIGN.md` — Visual design system tokens and guidelines (YAML frontmatter + prose). Source of truth for colors, typography, spacing, shapes, components, and do's/don'ts. Agents MUST read this file before generating or modifying any UI code.

### Stitch Design Project

- **Project ID:** `13066618688962361429`
- **Design Systems:**
  - _Velocity Mono_ (`assets/4da4e0fa38de45f999edd03d6dce272e`) — Light theme, judge app. Primary `#8b5cf6`, Inter + Space Grotesk.
  - _Score Design_ (`assets/14703007728964935566`) — Dark theme, admin/leaderboard. Primary `#1978e5`, Inter.

## Stack

- **Angular 21** — standalone, signals (`signal`, `computed`, `effect`), signal `input()`/`output()`/`model()`, `inject()`, native control flow (`@if`/`@for`/`@switch`), `OnPush`, Resource API, typed reactive forms.
- **Signal stores** — @ngrx/signals for feature state (where needed).
- **Astro 4+** — leaderboard app.
- **Tailwind CSS v4** — utility-first, via `@tailwindcss/postcss` + `@tailwindcss/vite`. No Angular Material, no custom CSS classes, no inline styles.
- **Heroicons** — icon system.
- **Vite 7** — bundler/dev server (Angular apps via `@analogjs/vite-plugin-angular`, leaderboard native).
- **Vitest 4** — single test runner across the workspace (`@analogjs/vitest-angular` for Angular, `@vitest/coverage-v8`, `jsdom`).
- **Nx 22** — monorepo orchestration (`affected`, path aliases, module boundaries).
- **Supabase** — Postgres 17 + PostgREST + Auth + Realtime + RLS. Project `blgssvpsobfpfxghigca` · region `eu-west-3`. Generated types in `libs/types/src/database.types.ts`.
- **Plane** — project management. Workspace: H.E.R.O. Project ID: `97eb5462-8f93-4bc3-9de2-1dfa6c782954` (use this directly when creating work items, do not list projects first).
- **Vercel** — 3 independent deployments, 1 repo.
- **TypeScript ~5.9**, **ESLint 9** + `angular-eslint`, **Prettier 3**.

## Setup

```sh
pnpm install
```

Env vars in `.env` (already present): `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

### Supabase RLS — `scores` table

`Scores` RLS was relaxed for dev because the judge app uses the anon key (no user JWT). The original
`scores_insert_judge` policy required `judge_id = auth.uid() AND is_assigned_judge(athlete_id)`,
which fails with anon key (`auth.uid()` = NULL). Additionally, `athlete_id` was `NOT NULL` but is
`NULL` for team scores.

Applied changes:
- **`athlete_id`** column made nullable (FK to `athletes(id)` with ON DELETE CASCADE remains).
- **DROP** `scores_insert_judge`, `scores_update_judge`.
- **CREATE** `scores_insert_authenticated`, `scores_insert_anon`, `scores_update_authenticated`,
  `scores_update_anon` — all with `USING (true)` / `WITH CHECK (true)`.
- SELECT remains open via existing `scores_select_all`.

If auth/JWT login is implemented later, tighten these policies to check `judge_id = auth.uid()`.

## Dev / build / lint

```sh
npx nx serve <app>
npx nx build <app>
npx nx lint <project>
npx nx typecheck <project>
npx nx affected -t build lint test
```

## Testing

- **All tests use Vitest.** Do not introduce Jest, Jasmine, Karma, or Cypress in new code, even if older docs mention them.
- Test files: `*.spec.ts` next to the code under test.
- Run: `npx nx test <project>` or `npx nx affected -t test`.
- **DI style:** Always use `inject()` — NEVER `@Inject()` constructor injection. Never instantiate services with `new ClassName(mock1, mock2)`.
- **TestBed setup:** Call `setupTestBed()` from `@analogjs/vitest-angular/setup-testbed` at MODULE LEVEL (outside describe()) in each spec file. Do NOT put it in test-setup.ts.
- **Component tests:** Use TestBed + fixture.nativeElement — NEVER @testing-library/angular.
- **Pure classes** (stores, mappers, domain models): instantiate directly with `new`, no TestBed needed.
- Mock Supabase — never hit the real DB from tests.

## Code rules

- Angular: standalone components, `OnPush`, `inject()`, signal `input()` / `output()`, native control flow (`@if`/`@for`/`@switch`). No `NgModule`, no constructor DI, no `*ngIf`/`*ngFor`, no `BehaviorSubject` in stores.
- State: `@ngrx/signals` signal stores.
- Styling: Tailwind v4 utilities only. No custom CSS classes, no inline styles, no Angular Material.
- Architecture: DDD + Hexagonal.
  - Supabase queries **only** inside `libs/contexts/*/src/infrastructure/` and `libs/core/src/supabase/`.
  - `libs/contexts/*/src/domain/` has zero runtime deps (no Angular, no Supabase).
  - `apps/*` never import from another app.
  - Cross-lib imports go through NX path aliases (`@hero/*`) — never relative paths.
- Naming: `*.entity.ts`, `*.vo.ts`, `*.use-case.ts`, `*.repository.ts`, `*.repository.supabase.ts`, `*.mapper.ts`, `*.store.ts`, `*.component.ts`, `*.spec.ts`.

Do not invent specific component names or fixed feature lists — the product is still evolving. Follow the patterns, not the examples in `docs/`.

## Commits

Conventional Commits. Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `style`. Scopes: `admin`, `judge`, `leaderboard`, `domain`, `infra`, `ui`, `nx`.

Keep commit messages short — single line, imperative, ≤ 72 chars. No body unless strictly necessary.

## PR checklist

- `nx affected -t lint test typecheck build` passes.
- New logic has Vitest tests.
- No Supabase calls outside `libs/infra/repositories/`.
- No relative cross-lib imports.

## OpenSpec Workflow — Plane Work Item Sync (MANDATORY)

Every step of the OpenSpec workflow MUST update the matching Plane work item:

| Step | Action | State |
|---|---|---|
| **proposal** | Find HERO-X work item, transition to In Progress | `In Progress` |
| **apply** (start implementation) | Transition to In Progress (if not already) | `In Progress` |
| **archive** | Transition to Done | `Done` |

**How to do it:**
1. Call `plane_list_states(project_id="97eb5462-8f93-4bc3-9de2-1dfa6c782954")` to find the state UUIDs for "In Progress" and "Done"
2. Call `plane_update_work_item(project_id, work_item_id, state="<uuid>")`
3. Inform the user: `Plane work item updated: https://app.plane.so/omg-projects/browse/HERO-XX → <State>`

Do NOT skip this. Do NOT assume I'll remember — read this every time.

## Agents

Project-specific subagents. Delegate to them via `task` tool when their domain matches.

- **`db-hero`** — Database specialist. **MUST be delegated for:** schema migrations, RLS policies, new/changed tables, regenerating `database.types.ts`, Supabase queries, infrastructure-layer repository code (`*/*.repository.supabase.ts`), mappers (`*/*.mapper.ts`), and any Supabase CLI operations. Do NOT write Supabase queries directly — delegate to db-hero. Defined in `.opencode/agents/db-hero.md`.

## Skills

Invoke these skills when relevant — they encode patterns this repo follows:

- `ponytail` — **Always active by default** at `full` intensity. Enforces the laziest correct solution: standard library over custom code, native platform features over dependencies, delete before add. Questions whether the task exists at all (YAGNI). Triggers automatically on any code generation or modification — always optimize for minimal complexity.

- `angular-component` — building/refactoring Angular 20+ standalone components (signals, OnPush, host bindings).
- `angular-forms` — signal-based forms.
- `angular-testing` — Vitest + TestBed patterns for signal components.
- `clean-ddd-hexagonal` — DDD/Hexagonal layering for `libs/domain` and `libs/infra`. **MUST be invoked whenever creating or modifying a new feature or screen.**
- `tailwind-design-system` — Tailwind v4 design tokens and component patterns.
- `ui-ux-pro-max` — UI/UX review and design decisions.
- `web-design-guidelines` — accessibility and UX audit.
