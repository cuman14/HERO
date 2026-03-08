import { Score } from '../entities/score.entity';

/**
 * IScoreRepository — Port (Interface)
 *
 * The domain defines WHAT it needs, not HOW it's done.
 * Supabase implementation lives in libs/infra.
 */
export interface IScoreRepository {
  save(score: Score): Promise<Score>;
  findById(id: string): Promise<Score | null>;
  findByWodAndAthlete(wodId: string, athleteId: string): Promise<Score | null>;
  findByHeat(heatId: string): Promise<Score[]>;
  delete(id: string): Promise<void>;
}
