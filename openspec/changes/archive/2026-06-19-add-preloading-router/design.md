## Context

La app Judge usa lazy-loading en sus rutas (scoring, resultados, etc.) pero no define una estrategia de precarga explícita. Angular por defecto usa `NoPreloading`, que descarga cada chunk solo cuando se navega a la ruta.

## Goals / Non-Goals

**Goals:**
- Activar `PreloadAllModules` para que todos los chunks lazy-loaded se descarguen en segundo plano tras la carga inicial
- Cero cambios en la lógica de negocio o estructura de rutas

**Non-Goals:**
- No se evalúan estrategias de precarga más avanzadas (como `PreloadingStrategy` personalizada con prioridades)
- No se modifica la estructura de routing existente

## Decisions

- **Estrategia:** `PreloadAllModules` de Angular — es la estrategia nativa más simple, cubre el caso de uso (app pequeña, ~6 rutas lazy). Si en el futuro hay decenas de rutas, se puede migrar a una estrategia personalizada con prioridades.
- **Implementación:** Se añade `withPreloading(PreloadAllModules)` como tercer argumento de `provideRouter` — es la API estándar de Angular v17+.

## Risks / Trade-offs

- Precargar todos los módulos aumenta ligeramente el tráfico de red inicial, pero como son chunks pequeños (~2-5 KB gzip cada uno) el impacto es negligible comparado con la mejora en navegabilidad
- Si el service worker ya cacheó los chunks (instalación previa), `PreloadAllModules` no tiene efecto adicional
