## Why

Google Fonts CSS se carga desde CDN externo en `apps/judge/index.html` sin preconexión. Esto añade latencia DNS/TCP/TLS antes de que el navegador pueda descargar las fuentes. Añadir `<link rel="preconnect">` reduce el tiempo de conexión cuando las fuentes locales no están disponibles.

Plan de rendimiento PIP-001 — Quick Win #2.

## What Changes

- Añadir `<link rel="preconnect" href="https://fonts.googleapis.com">` antes del CSS link existente
- Añadir `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` antes del CSS link existente
- Solo afecta a `apps/judge/index.html`

## Capabilities

### New Capabilities

Ninguna — no hay nuevas capacidades funcionales. Es optimización de rendimiento pura.

### Modified Capabilities

Ninguna — no hay cambios en comportamiento funcional ni en specs existentes.

## Impact

- `apps/judge/index.html` — único archivo modificado
- Sin cambios en lógica, APIs, dependencias, o tests
- Sin breaking changes
