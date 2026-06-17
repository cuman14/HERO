## Context

The heat confirmation page (`libs/contexts/heat/src/feature/pages/heat-confirmation/`) currently supports both team and individual athlete views via a tab switcher. Product requires teams-only operation. The component uses Angular signals with a `TabSwitcherComponent` from `@hero/ui`.

The change is UI-only — no API, store, or data model changes. The `HeatConfirmationAthlete` model retains the `type` field since other parts of the system (e.g., scoring) may still reference it.

## Goals / Non-Goals

**Goals:**
- Remove the Individual tab from the heat confirmation page
- Eliminate all individual-specific computed signals and tab switching logic
- Keep teams as the sole view mode

**Non-Goals:**
- Do NOT modify the `HeatConfirmationAthlete` type or its `type` field — it remains `'team' | 'individual'` for compatibility with downstream consumers
- Do NOT change the `TabSwitcherComponent` — it's a generic UI component used elsewhere
- No API or data model changes

## Decisions

1. **Remove activeTab signal entirely** — Since there's only one view (teams), no tab state is needed. The `activeTab` signal and `onTabChange` handler are deleted. The `resolvedTab` computed and `activeAthletes` computed are replaced with a direct reference to the `teams` computed.

2. **Keep `TabSwitcherComponent` binding** — The `tabs` array changes from two items to a single `{ value: 'teams', label: 'Equipos' }` entry. The `TabSwitcherComponent` handles a single tab gracefully with no visible UI change (it shows just one tab label, no switching).

3. **Keep `individuals` computed removal local** — The `individuals` computed and all its references are deleted. Since no other component or service depends on this computed (it's a private class field), the change is fully contained.

## Risks / Trade-offs

- **TabSwitcher with one tab**: The component may render an unnecessary tab bar with a single label. This is acceptable — the visual result is cleaner than before and the component is generic. If desired later, a follow-up can hide the tab bar when only one tab exists.
- **No test changes needed**: Since teams was the default active tab, existing test fixtures already test the teams path. Removing the individual tab and its logic only removes code paths.
