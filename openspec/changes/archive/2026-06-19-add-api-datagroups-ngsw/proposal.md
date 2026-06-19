## Why

La app Judge usa Angular Service Worker pero no cachea respuestas de la API Supabase. Sin `dataGroups` en `ngsw-config.json`, las requests GET a Supabase fallan sin conexión, impidiendo que la app funcione offline con datos ya cargados.

## What Changes

- Añadir `dataGroups` en `apps/judge/ngsw-config.json` con una entrada `api-cache` que cachea GET requests a Supabase REST y Realtime
- Estrategia `freshness` (red primero, caché como fallback) para datos siempre actualizados cuando hay conexión

## Capabilities

### New Capabilities
- `api-cache`: Caché de respuestas GET de la API Supabase (REST + Realtime) via Angular Service Worker, permitiendo funcionamiento offline parcial

### Modified Capabilities
- Ninguna

## Impact

- Solo modifica `apps/judge/ngsw-config.json`
- Sin cambios en código de aplicación, dependencias ni base de datos
