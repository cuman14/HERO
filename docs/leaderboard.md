# Módulo Live Leaderboard

> `apps/leaderboard` · Astro · TV / Proyector / Móvil · Acento `emerald-600`

## Propósito

Pantalla pública sin login. Se proyecta en la TV del box durante la competición. Se actualiza automáticamente cuando los jueces envían scores.

---

## Características

| Feature | Descripción |
|---------|-------------|
| Sin login | URL pública compartible |
| Realtime | WebSocket Supabase → actualización < 200ms |
| Alto contraste | Diseñado para TV y proyectores (fondo oscuro `#0f172a`) |
| Multi-categoría | Filtro por categoría y nivel |
| Responsive | TV · Proyector · Smartphone |
| LIVE indicator | Dot rojo parpadeante cuando hay heat activo |
| Timer countdown | Tiempo restante del heat en curso |
| Delta column | Cambio de posición desde la última actualización (↑↓) |
| Medallas | 🥇🥈🥉 para top 3 con highlight de fila |

---

## Routing

```
/                         → redirect a /leaderboard/{último WOD activo}
/leaderboard/{wodId}      → leaderboard del WOD
/leaderboard/{wodId}/{levelCode}  → filtrado por nivel (rx, scaled...)
```

---

## Estructura

```
apps/leaderboard/src/
├── pages/
│   ├── index.astro                    # redirect
│   └── leaderboard/
│       └── [wodId].astro              # página principal
│
├── components/
│   ├── LeaderboardTable.tsx           # isla React/Preact — interactiva
│   ├── HeatTimer.tsx                  # isla — timer countdown
│   ├── LiveBadge.tsx                  # isla — dot parpadeante
│   └── CategoryFilter.tsx             # isla — filtro de categoría
│
└── layouts/
    └── LeaderboardLayout.astro        # shell estático (header, fondo oscuro)
```

---

## Suscripción Realtime

```typescript
// apps/leaderboard/src/components/LeaderboardTable.tsx
import { useEffect, useState } from 'preact/hooks';

export function LeaderboardTable({ wodId, initialScores }) {
  const [scores, setScores] = useState(initialScores);

  useEffect(() => {
    const channel = supabase
      .channel(`leaderboard:${wodId}`)
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'scores',
          filter: `wod_id=eq.${wodId}`,
        },
        // Debounce 300ms — no re-renderizar con cada keystroke del juez
        debounce((payload) => {
          setScores(prev => recalculateRanking(prev, payload.new));
        }, 300)
      )
      .subscribe();

    return () => channel.unsubscribe();
  }, [wodId]);

  return (
    <table>
      {scores.map((score, i) => (
        <LeaderboardRow key={score.athleteId} rank={i+1} score={score} />
      ))}
    </table>
  );
}
```

---

## Cálculo del ranking (client-side)

```typescript
function recalculateRanking(scores: Score[], updatedScore: Score): Score[] {
  // 1. Reemplazar/añadir el score actualizado
  const updated = scores.map(s =>
    s.athleteId === updatedScore.athleteId ? updatedScore : s
  );

  // 2. Filtrar solo submitted/confirmed
  const valid = updated.filter(s => ['submitted', 'confirmed'].includes(s.status));

  // 3. Ordenar por scoring_direction del WOD
  // higher_is_better → DESC por reps/kg
  // lower_is_better  → ASC por segundos
  return valid.sort((a, b) => {
    const aVal = extractNumericValue(a.value, a.wodType);
    const bVal = extractNumericValue(b.value, b.wodType);
    return a.wodScoringDirection === 'higher_is_better'
      ? bVal - aVal
      : aVal - bVal;
  });
}
```

---

## Modo TV — Diseño

```
┌──────────────────────────────────────────────────────────────────┐
│  🏋 H.E.R.O · WOD 2 — AMRAP 12 min            ● LIVE   03:42  │
│  fondo: #0f172a                                                  │
├─────┬──────────────────────┬──────────┬───────┬────┬────────────┤
│  #  │ Atleta               │ Categoría│ Score │ Δ  │ Estado     │
├─────┼──────────────────────┼──────────┼───────┼────┼────────────┤
│  1  │ Carlos Rodríguez     │ RX Masc. │  147  │ —  │ ✓ Completo │  ← fila dorada
│  2  │ Sara Jiménez         │ RX Fem.  │  143  │ ↑+2│ ● En curso │  ← fila plateada
│  3  │ Alejandro Martín     │ RX Masc. │  138  │ —  │ ✓ Completo │  ← fila bronce
│  4  │ Laura Gómez          │ RX Fem.  │  121  │ ↑+1│ ● En curso │
│  5  │ David García         │ RX Masc. │  108  │ —  │ ● En curso │
└─────┴──────────────────────┴──────────┴───────┴────┴────────────┘

Fuentes: JetBrains Mono para scores/posiciones. Inter para nombres.
Scores en white (#f1f5f9). Posición 1 en amber (#fbbf24).
```

---

## URL para la demo

La URL del leaderboard se proyecta en la TV/pantalla durante el evento.  
Formato: `https://hero-live.vercel.app/leaderboard/{wodId}`

---

## Rendimiento

| Métrica | Objetivo |
|---------|---------|
| Latencia Realtime | < 200ms |
| Debounce re-render | 300ms |
| Activar Realtime | Solo cuando el componente es visible (IntersectionObserver) |
| LCP | < 2.5s |
| CLS | < 0.1 |
