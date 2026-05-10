// Score Context Public API

// Domain
export { BibNumber } from './domain/bib-number.vo';
export { ScoreValue } from './domain/score-value.vo';
export { Score, type ScoreProps } from './domain/score.model';
export {
  AmrapStrategy,
  ForTimeStrategy,
  MaxWeightStrategy,
  type ScoringStrategy,
} from './domain/scoring.strategy';

// Infrastructure
export { MovementMapper } from './infrastructure/mappers/movement.mapper';
export { RepetitionRecordMapper } from './infrastructure/mappers/repetition-record.mapper';
export {
  MOVEMENT_REPOSITORY,
  type MovementRepository,
} from './infrastructure/movement.repository';
export { SupabaseMovementRepository } from './infrastructure/movement.repository.supabase';
export {
  REPETITION_RECORD_REPOSITORY,
  type RepetitionRecordRepository,
} from './infrastructure/repetition-record.repository';
export { SupabaseRepetitionRecordRepository } from './infrastructure/repetition-record.repository.supabase';
export {
  ScoreMapper,
  type SupabaseScoreRow,
} from './infrastructure/score.mapper';
export {
  SCORE_REPOSITORY,
  type ScoreRepository,
} from './infrastructure/score.repository';
export { SupabaseScoreRepository } from './infrastructure/score.repository.supabase';

export * from './feature';
