// Score Context Public API

// Domain
export { Score, type ScoreProps } from './domain/score.model';
export { ScoreValue } from './domain/score-value.vo';
export { BibNumber } from './domain/bib-number.vo';
export {
  type ScoringStrategy,
  AmrapStrategy,
  ForTimeStrategy,
  MaxWeightStrategy,
} from './domain/scoring.strategy';

// Infrastructure
export { type ScoreRepository, SCORE_REPOSITORY } from './infrastructure/score.repository';
export { ScoreMapper, type SupabaseScoreRow } from './infrastructure/score.mapper';
export { SupabaseScoreRepository } from './infrastructure/score.repository.supabase';
