## ADDED Requirements

This change is a pure performance optimization (PIP-001 Quick Win #2). No new functional requirements.

## ADDED Requirements

### Requirement: Preconnect hints for Google Fonts CDN
The system SHALL include `<link rel="preconnect">` hints for Google Fonts origins before the Google Fonts CSS stylesheet link.

#### Scenario: Preconnect renders in HTML
- **WHEN** the browser parses `apps/judge/index.html`
- **THEN** `<link rel="preconnect" href="https://fonts.googleapis.com">` SHALL appear before any Google Fonts CSS link
- **THEN** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` SHALL appear before any Google Fonts CSS link
