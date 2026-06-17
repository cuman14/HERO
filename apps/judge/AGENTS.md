# Judge Interface — AGENTS.md

Real-time score entry app for judges during CrossFit / Hyrox competitions.

- **Framework:** Angular 21 standalone + PWA
- **State:** @ngrx/signals signal store
- **Styling:** Tailwind v4 (violet-600 accent)
- **Target:** Mobile-first, works offline

## Flujo — 4 pasos

1. **Selección** — Toggle individual/equipo, WOD activo, lista de heats
2. **Scoring** — Numpad (individual) o inputs por miembro (equipo)
3. **Confirmación** — Resumen, opción penalización/disputa
4. **Siguiente** — Si hay más atletas en el heat

## Estructura

```
apps/judge/src/app/features/scoring/
├── components/              # DUMB — inputs/outputs
│   ├── score-numpad/
│   ├── athlete-header/
│   ├── score-summary/
│   └── team-member-inputs/
├── containers/              # SMART — inyecta stores
│   └── scoring-page/
├── store/
│   └── scoring.store.ts     # @ngrx/signals
└── scoring.routes.ts
```

## Signal Store

**State:**
- `step` — 'numpad' | 'team' | 'confirm'
- `currentAthlete` — HeatAthlete | null
- `inputValue` — number (individual)
- `memberReps` — Record<string, number> (equipo)
- `isSubmitting` — boolean
- `error` — string | null
- `pendingQueue` — OfflineScore[] (cola offline)

**Computed:**
- `isValid` — inputValue > 0 (individual) o todos miembros > 0 (equipo)
- `effectiveReps` — inputValue - penaltyReps
- `totalTeamReps` — sum(memberReps)

**Methods:**
- `appendDigit(digit: number)` — numpad entry
- `backspace()` — delete last digit
- `setPenalty(reps: number)` — add penalty
- `submitScore()` — upsert a BD
- `syncOfflineQueue()` — procesar cola FIFO

## Decisiones clave

**Numpad, no tap-to-increment:** El juez cuenta reps en su cabeza durante el WOD. Introduce el total de una vez — exactamente como anotar en papel.

**UPSERT, no INSERT:** Un atleta = un score por WOD (`UNIQUE(wod_id, athlete_id)`). Si el juez corrige, upsert — no inserta segundo registro.

**Offline-first:** Sin Wi-Fi, scores se guardan localmente (IndexedDB). Badge "📶 Offline — N pendientes" en cabecera. Al recuperar conexión, queue se procesa FIFO.

## Accesibilidad

- Touch targets ≥ 48×48px (WCAG AA, funciona con guantes)
- Fuente mínima 14px
- Contraste mínimo 4.5:1 (violet-600 sobre white = 4.9:1 ✓)

## Score states

- `draft` — juez introduciendo
- `submitted` — confirmado, enviado a BD
- `confirmed` — admin validó
- `disputed` — reclamación
- `void` — anulado

## Heat confirmation — contextual arrow/eye icons

- `getHeatConfirmationData()` en heat repository combina fetch del heat + atletas + scores submitted.
- `HeatConfirmationAthlete.scored` se resuelve cotejando `athlete_id`/`team_id` de scores contra `heat_athletes`.
- `AthleteCardComponent` tiene input `scored: boolean`. Muestra badge "Listo" + icono ojo + borde emerald si es true.
- Click en atleta scored → navega a `/scoring/:heatAthleteId/summary?readonly=true` (SummaryPage modo lectura).
- Click en atleta no-scored → navega directamente a `/heat-confirmation-summary?heatCode=X&athleteId=Y`.
- Footer con botón "Continuar" y lógica de selección (`selectedId`, `canContinue`, `toggleSelection`) eliminados — toda la navegación es directa desde las tarjetas.

## Score summary — post-finalize navigation

- `SummaryPage` tras `finalizeScore()` exitoso navega a `/heat-confirmation?heatCode=...`.
- `heatCode` se extrae de `facade.athleteHeat()?.heatName`.

## Error handling

- Códigos de error `H00{n}` registrados en `apps/judge/src/app/core/error-handling/error-code.registry.ts`.
- `ErrorHandlingService` (global, providedIn: 'root') distingue errores de negocio (`H00{n}`, muestra código + mensaje) de errores 500/inesperados (modal genérico).
- `ErrorModalComponent` se renderiza en `app.html` desde el estado de `ErrorHandlingService`.
- El score context expone `ScoreErrorHandler` (token `SCORE_ERROR_HANDLER`) para que facades/pages notifiquen errores de persistencia sin depender del judge app directamente.
- Las páginas de scoring (`RegisterRepetitionsPage`, `SummaryPage`) manejan errores de `finalizeScore()` y `submitRepetitionCount()` mediante este token.

## Testing

- Vitest para dominio (use cases, value objects)
- Vitest + TestBed para componentes (signal inputs/outputs)
- Mock Supabase — nunca hit real DB
- Test offline queue behavior
- Test numpad digit appending + backspace
- Test team member reps summation
