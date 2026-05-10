# Módulo Judge Interface

> `apps/judge` · Angular 21 PWA · Mobile-first · Acento `violet-600`

## Propósito

El juez usa esta app en su smartphone durante la competición para registrar el score del atleta que tiene asignado.

---

## Flujo completo — 4 pasos

```
Login (juez)
    │
    ▼
① Selección
  - Toggle: Individual / Equipo
  - WOD activo (se obtiene del heat)
  - Lista de heats disponibles
    │
    ▼
② Scoring
  Individual:                    Equipo:
  - Numpad de entrada directa    - Input por miembro
  - Display grande del valor     - Suma automática del total
  - Borrar con ⌫                 - Total destacado
    │
    ▼
③ Confirmación (resumen)
  - Nombre atleta / equipo
  - Score final (grande)
  - Timer de cuándo se registró
  - Opción: añadir penalización
  - Opción: disputar score
    │
    ▼
④ Siguiente atleta (si hay más en el heat)
```

---

## Decisiones de diseño

### Por qué numpad y no tap-to-increment

El juez **cuenta las reps en su cabeza** durante el WOD. Al terminar, introduce el total de una vez — exactamente igual que anotar en un papel, pero digital. El tap-to-increment obliga a tocar el botón 147 veces y es propenso a errores.

### Por qué UPSERT y no INSERT

Un atleta tiene **un único score por WOD** (`UNIQUE(wod_id, athlete_id)`). Si el juez necesita corregir, la app hace upsert — no inserta un segundo registro.

### Offline-first

```
Sin Wi-Fi:
  1. Score se guarda localmente (IndexedDB)
  2. Badge "📶 Offline — N pendientes" en la cabecera
  3. El juez puede seguir anotando otros atletas

Al recuperar conexión:
  1. Queue se procesa en orden FIFO
  2. Badge desaparece
  3. Confirmación visual de cada score sincronizado
```

---

## Estructura del feature scoring

```
apps/judge/src/app/features/scoring/
│
├── components/                    # DUMB — solo inputs/outputs
│   ├── score-numpad/
│   │   ├── score-numpad.component.ts    # input: currentValue, output: valueChange, confirmed
│   │   └── score-numpad.component.spec.ts
│   │
│   ├── athlete-header/
│   │   └── athlete-header.component.ts  # input: athlete, heatStatus
│   │
│   ├── score-summary/
│   │   └── score-summary.component.ts   # input: score, athlete; output: confirmed, disputed
│   │
│   └── team-member-inputs/
│       └── team-member-inputs.component.ts  # input: members; output: repsChanged
│
├── containers/                    # SMART — inyecta stores
│   └── scoring-page/
│       └── scoring-page.component.ts
│
├── store/
│   ├── scoring.store.ts           # estado local del flujo
│   └── scoring.store.spec.ts
│
├── scoring.routes.ts
└── index.ts
```

---

## Signal Store del scoring

```typescript
// Estado
type ScoringState = {
  step:           'numpad' | 'team' | 'confirm';
  currentAthlete: HeatAthlete | null;
  inputValue:     number;
  memberReps:     Record<string, number>;   // equipo
  isSubmitting:   boolean;
  error:          string | null;
  pendingQueue:   OfflineScore[];           // cola offline
}

// Computed
isValid:      computed → inputValue > 0 (individual) o todos los miembros > 0 (equipo)
effectiveReps: computed → inputValue - penaltyReps
totalTeamReps: computed → sum(memberReps)

// Methods
appendDigit(digit: number): void
backspace(): void
setPenalty(reps: number): void
async submitScore(): Promise<void>
async syncOfflineQueue(): Promise<void>
```

---

## Reglas de accesibilidad

```css
/* Touch targets mínimos — WCAG AA */
.numpad-key {
  min-height: 48px;
  min-width:  48px;
  /* Funciona con guantes de entrenamiento */
}

/* Fuente mínima */
body { font-size: 14px; }

/* Contraste mínimo */
/* violet-600 sobre white = 4.9:1 ✓ */
/* text-slate-900 sobre white = 19:1 ✓ */
```

---

## Penalizaciones

```typescript
// Penalización añadida sobre el score final
interface Score {
  value:        { reps: number };
  penaltyReps:  number;           // default 0
  // El leaderboard usa: effectiveReps = value.reps - penaltyReps
}
```

---

## Estados del score (flujo)

```
draft      → el juez está introduciendo el score
submitted  → el juez confirmó, enviado a BD
confirmed  → el admin lo validó
disputed   → hay una reclamación
void       → anulado (no cuenta en ranking)
```

---

## Datos de la demo (Prime 2º Aniversario — 11 abril)

Los datos ya están seeded en Supabase:
- Equipos, atletas y `team_members` importados desde WodBuster
- `heat_athletes` con `team_id` (no `athlete_id`) para equipos
- Jueces asignados por heat en `heat_athletes.judge_id`
