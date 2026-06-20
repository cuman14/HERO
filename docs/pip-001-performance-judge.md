# PIP-001: Performance Improvement Plan — Judge App

**Status:** Draft
**Autor:** Oswald Megret
**Fecha:** 2026-06-19
**Proyecto:** H.E.R.O — `apps/judge`

---

## Resumen ejecutivo

La app Judge tiene buen scaffolding PWA pero carece de optimizaciones de carga inicial, caché de API y capa offline real. Este plan aborda 5 fases progresivas para mejorar métricas de Lighthouse, bundle size y experiencia offline.

**Baseline:** Se mide con `lhci autorun` local. El primer baseline se toma antes de cualquier cambio y se compara contra el target al final de cada fase.

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
| 9 | Sin assertions de rendimiento en CI | Bajo | Fase 0 |

---

## Fases

### Fase 0 — Baseline de métricas + CI

Stack mínimo — nada de dashboards custom, SaaS, ni Chart.js:

| Herramienta | Para qué |
|-------------|----------|
| `@lhci/cli` | Medir Lighthouse en local y CI |
| GitHub Actions | Ejecutar medición en cada PR automáticamente |
| `vite-bundle-visualizer` | Analizar bundle manualmente (opcional) |

**Paso 1 — Baseline local**
```bash
npm install -g @lhci/cli
nx build judge --configuration=production
lhci autorun --collect.staticDistDir=dist/apps/judge
```
Esto produce el JSON con métricas reales. Sin esto no hay con qué comparar.

**Paso 2 — `lighthouserc.json` en la raíz**
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "dist/apps/judge",
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:no-pbs",
      "assertions": {
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 3000 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Paso 3 — GitHub Actions workflow (`.github/workflows/perf-judge.yml`)**
```yaml
name: Judge Performance

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'apps/judge/**'
      - 'libs/**'

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx nx build judge --configuration=production
      - run: npm install -g @lhci/cli
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: \${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Flujo:** cada PR contra `apps/judge` o `libs/` ejecuta LHCI → 3 corridas promediadas → resultado visible como check en el PR + link al reporte. Si rompe un threshold → PR bloqueado. Feedback pasivo, sin recordatorios.

`vite-bundle-visualizer` se corre manualmente solo cuando se trabaja en optimización de bundle:
```bash
npx vite-bundle-visualizer --config apps/judge/vite.config.mts
```

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

### Sin dashboard custom

No se necesita. LHCI ya genera reportes HTML completos y los sube a `temporary-public-storage` con link en cada PR. Si en el futuro se requiere histórico, se activa `lhci upload --target=filesystem` y se publica en GitHub Pages, **sin Chart.js ni código custom**.

---

## Criterios de éxito (targets)

| Métrica | Antes | CI Assert | Target final |
|---------|-------|-----------|-------------|
| Lighthouse Performance | ? | — | ≥ 90 |
| Lighthouse PWA | 100 | — | 100 |
| FCP | ? | warn > 2s | ≤ 1.5s |
| LCP | ? | error > 3s | ≤ 2.5s |
| TBT | ? | warn > 300ms | ≤ 200ms |
| CLS | ? | error > 0.1 | ≤ 0.1 |
| Total initial JS (gzip) | ? | — | ≤ 100 KB |
| Offline score submission | ❌ | — | ✅ |

Los assertions de CI (columna "CI Assert") son tolerantes para no bloquear durante las fases. Al finalizar PIP-001 se ajustan a los targets finales.

---

## Decisiones (ADR)

Las decisiones arquitectónicas que surjan durante la implementación se registrarán en `docs/adr.md`.

---

## Referencias

- [docs/judge.md](../docs/judge.md)
- AGENTS.md (reglas PWA offline-first)
- `apps/judge/ngsw-config.json`
- `apps/judge/vite.config.mts`
