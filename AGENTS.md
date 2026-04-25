# AGENTS.md

Guidance for AI coding agents working in this repo. Human docs live in `docs/`; this file is the source of truth when they disagree.

## Project

H.E.R.O — real-time scoring platform for CrossFit / Hyrox. Nx monorepo with 3 independent apps sharing a Supabase backend.

- **apps/admin** — Angular 21 (desktop)
- **apps/judge** — Angular 21 PWA (mobile)
- **apps/leaderboard** — Astro (TV/projector)
- **libs/** — `domain`, `infra`, `ui-components`, `ui-shared`, `types`

App-specific guides (read on demand when working on that app):

- `docs/admin.md` — Admin Panel
- `docs/judge.md` — Judge Interface
- `docs/leaderboard.md` — Live Leaderboard

## Stack

- **Angular 21** — standalone, signals (`signal`, `computed`, `effect`), signal `input()`/`output()`/`model()`, `inject()`, native control flow (`@if`/`@for`/`@switch`), `OnPush`, Resource API, typed reactive forms.
- **@ngrx/signals** — signal stores for feature state.
- **Astro 4+** — leaderboard app.
- **Tailwind CSS v4** — utility-first, via `@tailwindcss/postcss` + `@tailwindcss/vite`. No Angular Material, no custom CSS classes, no inline styles.
- **Heroicons** — icon system.
- **Vite 7** — bundler/dev server (Angular apps via `@analogjs/vite-plugin-angular`, leaderboard native).
- **Vitest 4** — single test runner across the workspace (`@analogjs/vitest-angular` for Angular, `@vitest/coverage-v8`, `jsdom`).
- **Nx 22** — monorepo orchestration (`affected`, path aliases, module boundaries).
- **Supabase** — Postgres 17 + PostgREST + Auth + Realtime + RLS. Project `blgssvpsobfpfxghigca` · region `eu-west-3`. Generated types in `libs/types/src/database.types.ts`.
- **Vercel** — 3 independent deployments, 1 repo.
- **TypeScript ~5.9**, **ESLint 9** + `angular-eslint`, **Prettier 3**.

## Setup

```sh
pnpm install
```

Env vars in `.env` (already present): `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

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
- Mock Supabase — never hit the real DB from tests.

## Code rules

- Angular: standalone components, `OnPush`, `inject()`, signal `input()` / `output()`, native control flow (`@if`/`@for`/`@switch`). No `NgModule`, no constructor DI, no `*ngIf`/`*ngFor`, no `BehaviorSubject` in stores.
- State: `@ngrx/signals` signal stores.
- Styling: Tailwind v4 utilities only. No custom CSS classes, no inline styles, no Angular Material.
- Architecture: DDD + Hexagonal.
  - Supabase queries **only** inside `libs/infra/repositories/`.
  - `libs/domain` has zero runtime deps (no Angular, no Supabase).
  - `apps/*` never import from another app.
  - Cross-lib imports go through NX path aliases (`@hero/domain/*`, `@hero/infra/*`, `@hero/ui-components`, `@hero/ui-shared`, `@hero/types`) — never relative paths.
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

## Skills

Invoke these skills when relevant — they encode patterns this repo follows:

- `angular-component` — building/refactoring Angular 20+ standalone components (signals, OnPush, host bindings).
- `angular-forms` — signal-based forms.
- `angular-testing` — Vitest + TestBed patterns for signal components.
- `clean-ddd-hexagonal` — DDD/Hexagonal layering for `libs/domain` and `libs/infra`.
- `tailwind-design-system` — Tailwind v4 design tokens and component patterns.
- `ui-ux-pro-max` — UI/UX review and design decisions.
- `web-design-guidelines` — accessibility and UX audit.
