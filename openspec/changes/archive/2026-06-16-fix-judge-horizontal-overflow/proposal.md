## Why

The judge app has horizontal overflow on mobile — swiping left/right drags the entire page instead of keeping it locked to the viewport. This breaks the mobile scoring workflow on every page. Three reinforcing causes: a nested `<body>` tag in the register-repetitions template (invalid HTML, its `overflow-hidden` doesn't apply to the real document), no global `overflow-x: hidden` on `html/body`, and a `w-ful` typo in heat-access.

## What Changes

- **register-repetitions.page.html** — Replace the nested `<body>` root element with a `<div>` to produce valid HTML and let the real document body control overflow.
- **apps/judge/src/styles.css** — Add `overflow-x: hidden` to `html, body` to prevent horizontal scroll on every page.
- **heat-access.page.html** — Fix `w-ful` → `w-full` on the logo `<img>`.

## Capabilities

### New Capabilities

_(No new capabilities — this is a bug fix within existing screens.)_

### Modified Capabilities

_(No spec-level requirement changes — implementation details only.)_

## Impact

- `libs/contexts/score/src/feature/pages/register-repetitions/register-repetitions.page.html` — `<body>` → `<div>`
- `apps/judge/src/styles.css` — new `html, body { overflow-x: hidden; }`
- `libs/contexts/heat/src/feature/pages/heat-access/heat-access.page.html` — `w-ful` → `w-full`
