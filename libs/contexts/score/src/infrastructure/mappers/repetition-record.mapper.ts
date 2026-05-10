import {
  RepetitionCount,
  RepetitionRecord,
} from '../../domain/repetition-record.model';

export interface ScoreMovementRepRow {
  movementId: string;
  athleteId: string;
  heatId: string;
  judgeId: string;
  scoreId: string;
  reps: number;
  confirmed: boolean;
}

export type ScoreValueMovementReps = Record<
  string,
  { reps: number; confirmed: boolean }
>;

export class RepetitionRecordMapper {
  static toDomain(row: ScoreMovementRepRow): RepetitionRecord {
    return RepetitionRecord.create(`${row.scoreId}-${row.movementId}`, {
      movementId: row.movementId,
      athleteId: row.athleteId,
      heatId: row.heatId,
      count: RepetitionCount.create(row.reps),
      judgeId: row.judgeId,
      confirmed: row.confirmed,
      createdAt: new Date(),
    });
  }

  static toScoreValue(
    existing: ScoreValueMovementReps,
    record: RepetitionRecord,
  ): ScoreValueMovementReps {
    return {
      ...existing,
      [record.movementId]: {
        reps: record.count.value,
        confirmed: record.confirmed,
      },
    };
  }
}
