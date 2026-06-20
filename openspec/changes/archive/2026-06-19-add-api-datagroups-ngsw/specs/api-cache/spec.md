## ADDED Requirements

### Requirement: API responses cached in Service Worker
The `ngsw-config.json` SHALL include a `dataGroups` entry that caches GET responses from Supabase REST and Realtime APIs.

#### Scenario: GET request to Supabase REST is cached
- **WHEN** the Judge app makes a GET request to `/rest/v1/*` endpoint
- **THEN** the response SHALL be cached by the Service Worker with `freshness` strategy

#### Scenario: GET request to Supabase Realtime is cached
- **WHEN** the Judge app makes a GET request to `/realtime/v1/*` endpoint
- **THEN** the response SHALL be cached by the Service Worker with `freshness` strategy

#### Scenario: App works offline with cached data
- **WHEN** the device goes offline after previously loading data
- **THEN** cached API responses SHALL be served from cache

#### Scenario: Fresh data preferred when online
- **WHEN** the device is online and makes a GET request to a cached endpoint
- **THEN** the Service Worker SHALL attempt network first (`freshness` strategy) and fall back to cache on failure

#### Scenario: Cache entries expire
- **WHEN** a cached entry is older than 1 day
- **THEN** the Service Worker SHALL treat it as expired and fetch fresh data from network when online

#### Scenario: Cache size is bounded
- **WHEN** the cache reaches 100 entries
- **THEN** the Service Worker SHALL evict older entries following Angular SW cache eviction policy
