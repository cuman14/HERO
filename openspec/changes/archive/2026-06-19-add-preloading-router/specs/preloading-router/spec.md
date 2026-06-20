## ADDED Requirements

### Requirement: App preloads all lazy-loaded modules after bootstrap

The Judge app SHALL use Angular's `PreloadAllModules` strategy so that all
lazy-loaded route modules are downloaded in the background immediately after
the initial bundle finishes loading.

#### Scenario: Lazy chunks load after initial navigation

- **WHEN** the app finishes bootstrapping and the first route is activated
- **THEN** Angular starts downloading all remaining lazy chunks in the background

#### Scenario: Navigation to lazy route is instant after preload

- **WHEN** a user navigates to a route whose chunk has been preloaded
- **THEN** the router renders the route without fetching additional chunks
