## Contexto

El flujo del juez es lineal: **Heat Access → Heat Confirmation → Scoring**.
HeatConfirmationPage ya carga todos los datos necesarios (HeatConfirmationPayload)
via resolver. El juez selecciona un atleta y pulsa "Continuar". Actualmente eso
navega directo a /scoring — sin checkpoint.

Los componentes UI de @hero/ui ya existen y son reutilizables:
ButtonComponent, WodInfoCardComponent, AthleteCardComponent.

El diseño de referencia es la pantalla "Heat Confirmation Step 2 of 4" de Stitch
(Project: 13066618688962361429 · Screen: 96868ddb998d444dadb56809ed18b17f).

## Decisiones de arquitectura

### 1. Paso de datos: Router state via NavigationExtras.state

HeatConfirmationPage pasa `{ heatPayload, selectedAthleteId }` a través del
estado del router al navegar a /heat-confirmation-summary.
La nueva página lee ese estado desde `inject(Router).getCurrentNavigation()?.extras.state`.

**Motivo**: Los datos ya están en memoria. No se necesita otro resolver ni
llamada a Supabase. El router state mantiene el flujo sin estado global.

**Alternativa rechazada**: Query params + re-resolver → llamada redundante a Supabase.
**Alternativa rechazada**: Servicio signal compartido → sobreingeniería para una
navegación simple padre→hijo.

### 2. Estructura de ruta: Sibling route en heat.routes.ts

```typescript
// Estructura resultante en heat.routes.ts
{
  path: 'heat-confirmation-summary',
  loadComponent: () => import('./pages/heat-confirmation-summary/...')
}
```

Sibling de heat-confirmation — misma profundidad, flujo lineal consistente.

### 3. Fallback: Redirect a /heat-access si falta router state

Si se accede a /heat-confirmation-summary directamente (sin state),
redirige a /heat-access. Previene estados rotos.

### 4. Componente: Standalone, OnPush, sin interacción con store

No necesita SignalStore propio. Lee datos del router state en ngOnInit
y los expone como signals locales con signal(). Sin llamadas a facade ni repo.

## Diseño de la pantalla (Stitch reference)

```
┌──────────────────────────────────┐
│ ← Carlos Rodríguez               │  ← header (flecha + nombre atleta)
│   BIB #042 · RX MASC · HEAT-A3X9│  ← subtítulo
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │  WOD DETAILS (badge violet)│  │
│  │  WOD 2: AMRAP 12          │  │  ← nombre WOD grande
│  │  12:00                    │  │  ← timer grande (time cap)
│  │  ─────────────────────────│  │
│  │  DESCRIPCIÓN              │  │
│  │  21-15-9                  │  │  ← descripción
│  │  Repeticiones             │  │
│  │  [MOVIMIENTO 1] [MOV 2]   │  │  ← chips de movimientos
│  └────────────────────────────┘  │
│                                  │
│  ┌─ ⓘ amber banner ────────────┐ │
│  │ Asegúrate de que el atleta  │ │
│  │ ha validado su material...  │ │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  🏁  Iniciar WOD  (violet) │  │  ← botón primario full-width
│  └────────────────────────────┘  │
│     EL ATLETA DEBE ESTAR LISTO   │  ← subtítulo bajo botón
└──────────────────────────────────┘
```

## Mapa de componentes a reutilizar

| Elemento UI | Componente @hero/ui | Notas |
|---|---|---|
| Botón "Iniciar WOD" | ButtonComponent variant="primary" | Añadir emoji 🏁 via ng-content |
| Info del WOD (header) | WodInfoCardComponent | Solo lectura, no interactivo |
| Atleta seleccionado | AthleteCardComponent selected=true | No emite cardClick — decorativo |

## Estructura de archivos nueva

```
libs/contexts/heat/src/feature/pages/heat-confirmation-summary/
  ├── heat-confirmation-summary.page.ts
  ├── heat-confirmation-summary.page.html
  └── heat-confirmation-summary.page.spec.ts
```

## Cambio en heat-confirmation.page.ts

```typescript
// ANTES
onContinue(): void {
  if (!this.canContinue()) return;
  this.router.navigate(['/scoring']);
}

// DESPUÉS
onContinue(): void {
  if (!this.canContinue()) return;
  this.router.navigate(['/heat-confirmation-summary'], {
    state: {
      heatPayload: this.heatPayload(),
      selectedAthleteId: this.selectedId(),
    },
  });
}
```
