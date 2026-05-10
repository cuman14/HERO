# Score Context

Bounded context for scoring and repetition registration in H.E.R.O.

## Domain

| Class | Description |
|---|---|
| `Movement` | WOD movement entity with `name`, `order`, `targetReps` |
| `RepetitionRecord` | Tracks reps for one movement per athlete/heat |
| `RepetitionCount` | Value object — non-negative integer, enforces validation |
| `AthleteHeat` | Aggregate root linking an athlete/team to a heat |
| `Score`, `ScoreValue` | Final score entity and value object |

## Application

| Class | Description |
|---|---|
| `RegisterRepetitionsFacade` | Orchestrates load, submit, and realtime sync. Call `loadHeat(heatAthleteId)` with a real ID to connect to Supabase; omit for mock data (dev/demo). |
| `RegisterRepetitionsStore` | Signal-based state: movements, currentIndex, repetitionRecords, loading, error |

## Infrastructure

| Class | Token | Description |
|---|---|---|
| `SupabaseMovementRepository` | `MOVEMENT_REPOSITORY` | Fetches WOD movements from `wod_movements` |
| `SupabaseRepetitionRecordRepository` | `REPETITION_RECORD_REPOSITORY` | Upserts to `repetition_records`, subscribes to Realtime |
| `MovementMapper` | — | Maps `wod_movements` rows ↔ `Movement` domain objects |
| `RepetitionRecordMapper` | — | Maps `repetition_records` rows ↔ `RepetitionRecord` domain objects |

## Feature

`RegisterRepetitionsPage` — smart component. Accepts `@Input() heatAthleteId` from router params.

```
/judge/heat/:heatAthleteId/register
```

## Running tests

```bash
pnpm nx run score:test
```
