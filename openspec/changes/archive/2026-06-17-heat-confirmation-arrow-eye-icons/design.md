## Context

The heat-confirmation page is the first screen judges see after selecting a heat. It lists all athletes grouped by category with tab switching (teams/individual). Currently each athlete card has a checkbox for selection, requiring the judge to tap an athlete, then tap "Continuar" in the footer. For scored athletes the checkbox is misleading since they navigate directly to the summary page.

This change replaces the selection pattern with a direct-navigation pattern where each athlete card's right-side action shows a contextual icon — arrow for unscored, eye for scored — and clicking the card navigates immediately.

## Goals / Non-Goals

**Goals:**
- Eliminate the checkbox selection mechanism from AthleteCardComponent
- Add contextual arrow (→) icon for unscored athletes
- Add contextual eye (👁) icon for scored athletes
- Direct navigation on card click: unscored → `/heat-confirmation-summary`, scored → `/scoring/:id/summary?readonly=true`
- Remove the "Continuar" footer button and associated state (`selectedId`, `canContinue`, `toggleSelection`)
- Add eye icon to the HeroIconComponent icon registry
- Scored athletes visually distinct (accent border)

**Non-Goals:**
- Not changing the heat-confirmation-summary page itself (its behavior stays as-is)
- Not changing the SummaryPage (already supports readonly mode)
- Not changing the data flow (HeatConfirmationPayload, resolver, etc.)
- Not introducing new screens or routes

## Decisions

### 1. Icon source: HeroIconComponent vs inline SVG
**Decision:** Add `eye` icon to HeroIconComponent registry + use `lib-icon` with `arrow-right` for the arrow.

Arrow (`arrow-right`) already exists in the registry. The eye needs a new SVG path. This keeps the codebase consistent — all icons go through HeroIconComponent. The AthleteCardComponent will need to import HeroIconComponent (currently only imports CommonModule).

### 2. Scored card styling: accent border instead of selected border
**Decision:** Scored athletes get `border-emerald-300` (light) / `border-emerald-700` (dark) to visually distinguish them as "done." Non-scored cards use the default `border-slate-200` / `border-slate-800`. This replaces the previous `selected()`-based `border-primary` style.

The `cardClasses` computed switches from `selected()` to `scored()` for the accent treatment.

### 3. Footer removal
**Decision:** Remove the entire sticky footer section. No replacement needed — all navigation is now card-driven. The WOD info and judge name from the footer were already displayed redundantly (WOD info is in the WodInfoCard, judge name is non-critical info and can be removed).

### 4. Navigation for unscored athletes
**Decision:** `onAthleteClick` for unscored athletes now calls `router.navigate(['/heat-confirmation-summary'], { queryParams: { heatCode, athleteId } })` — the same route the "Continuar" button used. This reuses the existing resolver and page logic. The heat-confirmation-summary page remains the guardrail before scoring.

## Risks / Trade-offs

- **[Low] Orphaned code**: The `.html` template file outside the component (`heat-confirmation.page.html`) is not used (component uses inline template). The change should not touch this orphaned file to avoid confusion.
- **[Low] heat-confirmation-summary still receives `heatCode` via query param**: The resolver uses `queryParamMap.get('heatCode')` to fetch payload. This works identically whether navigated from the old "Continuar" button or the new card click — no resolver changes needed.
- **[Medium] Test coverage**: The spec files need significant updates — removal of selection logic means removing several test cases. New tests needed for arrow/eye rendering and direct navigation paths.
