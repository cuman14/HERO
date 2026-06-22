## Why

Material Symbols se cargan via @font-face y CSS en apps/judge pero ningún template los usa. Es código muerto que descarga un WOFF2 innecesario y añade CSS render-blocking.

## What Changes

- Eliminar bloque CSS `.material-symbols-outlined` de `apps/judge/index.html`
- Eliminar `@font-face` de MaterialSymbolsOutlined en `apps/judge/src/styles.css`
- Eliminar el archivo `apps/judge/public/fonts/MaterialSymbolsOutlined.woff2` si existe

## Capabilities

### New Capabilities

Ninguna. Es solo limpieza de código muerto.

### Modified Capabilities

Ninguna. No hay cambios de comportamiento.

## Impact

- `apps/judge/index.html` — eliminar ~20 líneas de CSS
- `apps/judge/src/styles.css` — eliminar ~6 líneas de @font-face
- `apps/judge/public/fonts/` — eliminar archivo woff2 (~45KB)
