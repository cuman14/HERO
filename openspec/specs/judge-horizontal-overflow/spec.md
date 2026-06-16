# Judge Horizontal Overflow

## Purpose

Prevent horizontal document scroll on mobile viewports in the judge app, fix invalid HTML in templates, and correct CSS class typos.

## Requirements

### Requirement: No horizontal document scroll on mobile

The judge app SHALL NOT have horizontal document-level scroll at viewport widths between 320px and 768px. Only intentionally scrollable children (e.g., vertically scrollable lists) MAY scroll.

#### Scenario: Swipe on mobile does not drag the page

- **WHEN** a user touches the screen and swipes left or right on any judge app page
- **THEN** the page stays fixed in place; only horizontal-scroll-capable children MAY scroll

#### Scenario: CSS overflow-x hidden on document root

- **WHEN** the judge app loads
- **THEN** `html` and `body` elements SHALL have `overflow-x: hidden` in computed styles

### Requirement: Valid HTML in register-repetitions template

The `register-repetitions.page.html` template SHALL NOT use a `<body>` element as its root, as nested `<body>` elements are invalid HTML.

#### Scenario: Template root is a div

- **WHEN** `register-repetitions.page.html` is parsed
- **THEN** its root element SHALL be a `<div>`, not a `<body>`

### Requirement: Correct CSS class on heat-access logo

The heat-access page logo image SHALL use a valid Tailwind width class.

#### Scenario: w-ful corrected to w-full

- **WHEN** the heat-access page renders
- **THEN** the logo `<img>` SHALL have `class="w-full"` instead of `class="w-ful"`
