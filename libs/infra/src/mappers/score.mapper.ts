import { Score, ScoreValue } from '@hero/domain';

/**
 * Interface representing the Supabase database row.
 */
export interface SupabaseScoreRow {
  id: string;
  wod_id: string;
  athlete_id: string;
  judge_id: string;
  reps: number;
  time_seconds: number | null;
  weight_kg: number | null;
  penalty_reps: number;
  confirmed: boolean;
  created_at: string;
}

/**
 * ScoreMapper — Mapper Pattern
 *
 * Isolates the Supabase schema from the Domain model.
 * A database column change only affects this file.
 */
export class ScoreMapper {
  static toDomain(row: SupabaseScoreRow): Score {
    let value: ScoreValue;

    if (row.time_seconds !== null) {
      value = ScoreValue.fromTime(row.time_seconds);
    } else if (row.weight_kg !== null) {
      value = ScoreValue.fromWeight(row.weight_kg);
    } else {
      value = ScoreValue.fromReps(row.reps);
    }

    return Score.create(row.id, {
      wodId: row.wod_id,
      athleteId: row.athlete_id,
      judgeId: row.judge_id,
      value,
      penaltyReps: row.penalty_reps,
      confirmed: row.confirmed,
      createdAt: new Date(row.created_at),
    });
  }

  static toPersistence(score: Score): SupabaseScoreRow {
    return {
      id: score.id,
      wod_id: score.wodId,
      athlete_id: score.athleteId,
      judge_id: score.judgeId,
      reps: score.value.reps,
      time_seconds: score.value.time ?? null,
      weight_kg: score.value.weight ?? null,
      penalty_reps: score.penaltyReps,
      confirmed: score.confirmed,
      created_at: score.getProps().createdAt.toISOString(),
    };
  }
}
