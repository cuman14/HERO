# Agent Configuration Consistency

**Last updated:** May 10, 2026

## Single Source of Truth

All agent configuration is now consolidated in `.windsurf/`:
- `.windsurf/rules/app-rules.md` — Deprecated. Use `AGENTS.md` instead.
- `.windsurf/skills/` — All agent skills
- `.windsurf/workflows/` — All workflows

**Primary reference:** `AGENTS.md` (root) — source of truth for all development guidance.

## Removed Duplicates

- Deleted `.agent/` directory (empty shell)
- Deleted `.claude/` directory (empty shell)
- Deleted duplicate rule files from `.agent/rules/` and `.claude/`

## Key Corrections in AGENTS.md

1. **Libs structure:** Updated from non-existent `domain/`, `infra/`, `ui-components/`, `ui-shared/` to actual structure:
   - `libs/contexts/` (heat, score)
   - `libs/core/`
   - `libs/types/`
   - `libs/ui/`

2. **Testing approach:** Clarified Vitest + TestBed pattern (NOT @testing-library/angular):
   - `setupTestBed()` at module level
   - Use `fixture.nativeElement` for component tests
   - Pure classes instantiated directly with `new`

3. **Supabase queries:** Updated paths:
   - `libs/contexts/*/src/infrastructure/`
   - `libs/core/src/supabase/`

4. **Path aliases:** Simplified to `@hero/*` (was `@H.E.R.O/`)

## Consistency Rules for Agents

- Always reference `AGENTS.md` as the source of truth
- Do not create new rule files in `.agent/` or `.claude/`
- Use `.windsurf/skills/` for any new agent skills
- Use `.windsurf/workflows/` for any new workflows
