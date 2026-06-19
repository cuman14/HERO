# PIP-001: Performance Improvement Plan — Judge App

**Status:** Draft
**Autor:** Oswald Megret
**Fecha:** 2026-06-19
**Proyecto:** H.E.R.O — `apps/judge`

---

## Resumen ejecutivo

La app Judge tiene buen scaffolding PWA pero carece de optimizaciones de carga inicial, caché de API y capa offline real. Este plan aborda 5 fases progresivas para mejorar métricas de Lighthouse, bundle size y experiencia offline.

**Baseline (medido el 2026-06-19):** Pendiente de ejecutar `lhci autorun`.

---

## Problemas detectados

| # | Problema | Impacto | Fase |
|---|----------|---------|------|
| 1 | Fuentes Google desde CDN externo (render-blocking) | Alto | Fase 1 |
| 2 | `logo.png` de 192 KB | Medio | Fase 1 |
| 3 | Sin `dataGroups` en ngsw-config — API sin caché | Alto | Fase 1 |
| 4 | `NoPreloading` por defecto — chunks no se precargan | Medio | Fase 1 |
| 5 | Sin `manualChunks` en Vite — vendor bundles mezclados | Medio | Fase 2 |
| 6 | Sin `budgets` en project.json | Bajo | Fase 2 |
| 7 | Sin `@defer` en componentes pesados | Medio | Fase 3 |
| 8 | Sin cola offline — scores fallan sin conexión | Crítico | Fase 4 |
| 9 | Sin dashboard de métricas automatizado | Bajo | Dashboard |

---

## Fases

### Fase 1 — Quick Wins
- Autoalojar fuentes (Inter + Space Grotesk + Material Symbols) en `public/fonts/`
- Añadir `<link rel="preconnect">` a Google Fonts como fallback
- Eliminar `logo.png`, usar solo `logo.svg`
- Cambiar `<title>` a `"Hero Judge"`
- Añadir `withPreloading(PreloadAllModules)` en `provideRouter`
- Añadir `dataGroups` en `ngsw-config.json` para cachear respuestas API

### Fase 2 — Code Splitting + Budgets
- Configurar `build.rollupOptions.output.manualChunks` en `vite.config.mts`
- Separar vendor chunks (Supabase, rxjs, @ngrx/signals)
- Añadir `budgets` en `project.json` (initial: 500 KB, anyComponentStyle: 2 KB)

### Fase 3 — @defer en componentes pesados
- `SignaturePadComponent` → `@defer` con trigger `on idle`
- `ResultHeroComponent` → `@defer` con trigger `on viewport`
- `RoundBreakdownListComponent` → `@defer`
- Evaluar si Material Symbols se puede eliminar en favor de Heroicons

### Fase 4 — Offline Queue
- Instalar `idb` (wrapper mínimo de IndexedDB, ~1 KB)
- Crear `OfflineScoreQueue` en `libs/contexts/score/src/infrastructure/`
- Modificar `SupabaseScoreRepository` para encolar cuando `!navigator.onLine`
- Implementar `syncOfflineQueue()` FIFO al recuperar conexión
- Indicador visual "Offline — N pendientes" en cabecera

### Dashboard de métricas
- Workflow GitHub Actions que corre `lhci autorun`
- Dashboard desplegado a GitHub Pages con Chart.js
- Histórico de métricas visible en `username.github.io/hero/perf/`

---

## Criterios de éxito (targets)

| Métrica | Antes | Target |
|---------|-------|--------|
| Lighthouse Performance | ? | ≥ 90 |
| Lighthouse PWA | 100 | 100 |
| FCP | ? | ≤ 1.5s |
| LCP | ? | ≤ 2.5s |
| TBT | ? | ≤ 200ms |
| CLS | ? | ≤ 0.1 |
| Total initial JS (gzip) | ? | ≤ 100 KB |
| Offline score submission | ❌ | ✅ |

---

## Decisiones (ADR)

Las decisiones arquitectónicas que surjan durante la implementación se registrarán en `docs/adr.md`.

---

## Referencias

- [docs/judge.md](../docs/judge.md)
- AGENTS.md (reglas PWA offline-first)
- `apps/judge/ngsw-config.json`
- `apps/judge/vite.config.mts`
