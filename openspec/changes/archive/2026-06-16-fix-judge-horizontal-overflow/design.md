## Context

The judge app scrolls horizontally on mobile because the real `<body>` and `<html>` elements have no `overflow-x` constraint, and one page (`register-repetitions.page.html`) wraps its template in a literal `<body>` tag — which is invalid HTML and whose `overflow-hidden` only clips its own subtree, not the document root.

## Goals / Non-Goals

**Goals:**

- Eliminate horizontal document scroll on all judge app pages at viewport widths 320–768px.
- Replace the invalid nested `<body>` in `register-repetitions.page.html` with a `<div>`.
- Add `overflow-x: hidden` to `html, body` in the global stylesheet.
- Fix `w-ful` → `w-full` typo on heat-access logo.

**Non-Goals:**

- No layout or visual changes beyond overflow prevention.
- No changes to `heat-access` page theme (it intentionally keeps its own identity).
- No changes outside the judge app.

## Decisions

### 1. Global CSS, not per-page

**Decision:** Add `html, body { overflow-x: hidden; }` to `apps/judge/src/styles.css`. No per-page overrides.

**Rationale:** The issue affects every page. Adding it once at the root is simpler, less error-prone, and avoids repeating the same fix. If a future page genuinely needs horizontal scroll (e.g., a data table), that page can override locally.

**Alternative considered:** Per-page `overflow-x-hidden` on each component root. Rejected: requires touching every page and is easy to miss on new pages.

### 2. `<body>` → `<div>`, no other structural change

**Decision:** Replace the `<body>` tag and its closing tag with `<div>` / `</div>`. Keep all existing classes and content unchanged.

**Rationale:** The template is otherwise correct. The `<body>` does nothing that a `<div>` wouldn't, and removing it fixes the HTML validity issue. No need to refactor the component tree.

## Risks / Trade-offs

- **No verifiable CSS test for overflow** → jsdom doesn't render layout, so `overflow-x: hidden` presence in computed styles can be asserted but actual "no scroll" behavior can't be tested in Vitest. Mitigation: manual swipe test on real device / emulator.
- **`overflow-x: hidden` on body can clip focus rings** → If an interactive element outside the viewport receives focus (e.g., skip link), the ring may be clipped. Acceptable for a mobile-first app; users navigate by touch.
