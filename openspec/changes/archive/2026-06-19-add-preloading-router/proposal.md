## Why

La app Judge usa `NoPreloading` por defecto en Angular — los chunks de lazy-loading solo se descargan al navegar a cada ruta. Esto causa micro-pausas visibles al cambiar de pantalla, especialmente en conexiones lentas o modo offline. `PreloadAllModules` precarga todos los chunks en segundo plano tras la carga inicial, mejorando la navegabilidad sin aumentar el bundle inicial.

## What Changes

- Añadir `withPreloading(PreloadAllModules)` como estrategia de precarga en `provideRouter` dentro de `apps/judge/src/app/app.config.ts`
- Importar `withPreloading` y `PreloadAllModules` desde `@angular/router`

## Capabilities

### New Capabilities

- `preloading-router`: Estrategia de precarga de todos los módulos lazy-loaded en segundo plano para la app Judge

### Modified Capabilities

*(ninguna — no cambian requisitos a nivel de spec)*

## Impact

- **Código modificado:** `apps/judge/src/app/app.config.ts` (1 línea modificada, 1 línea de import añadida)
- **Sin cambios en APIs, dependencias, o schemas de DB**
