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
