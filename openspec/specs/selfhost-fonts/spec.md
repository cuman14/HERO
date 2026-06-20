## Purpose

Serve Inter, Space Grotesk, and Material Symbols fonts locally to eliminate external network requests and improve offline performance.

## Requirements

### Requirement: Font files are served locally

The system SHALL serve Inter, Space Grotesk, and Material Symbols fonts from the local `apps/judge/public/fonts/` directory instead of Google Fonts CDN.

#### Scenario: Font files exist locally
- **WHEN** the judge app loads
- **THEN** font files are served from `/fonts/inter/*.woff2`, `/fonts/space-grotesk/*.woff2`, and `/fonts/material-symbols/*.woff2`

### Requirement: @font-face declarations use local URLs

The system SHALL declare `@font-face` rules pointing to local font files in `styles.css` or equivalent global stylesheet.

#### Scenario: Font is rendered using local file
- **WHEN** the browser renders text using Inter font
- **THEN** the `@font-face` `src` points to `/fonts/inter/inter-400.woff2` (not a Google Fonts URL)

### Requirement: Google Fonts links are removed

The system SHALL remove `<link>` tags to Google Fonts from `index.html`.

#### Scenario: No external font requests
- **WHEN** loading the judge app
- **THEN** no network requests are made to `fonts.googleapis.com` or `fonts.gstatic.com`

### Requirement: Fallback font stack is preserved

The system SHALL include `system-ui, sans-serif` as fallback in font-family declarations.

#### Scenario: Local font fails to load
- **WHEN** a local font file is unavailable
- **THEN** the browser falls back to `system-ui, sans-serif`
