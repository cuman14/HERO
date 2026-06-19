## Purpose

Add `<link rel="preconnect">` hints for Google Fonts CDN origins as a performance optimization when fonts are loaded externally.

## Requirements

### Requirement: Preconnect hints for Google Fonts CDN

The system SHALL include `<link rel="preconnect">` hints for Google Fonts origins before the Google Fonts CSS stylesheet link.

#### Scenario: Preconnect renders in HTML
- **WHEN** the browser parses `apps/judge/index.html`
- **THEN** `<link rel="preconnect" href="https://fonts.googleapis.com">` SHALL appear before any Google Fonts CSS link
- **THEN** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` SHALL appear before any Google Fonts CSS link
