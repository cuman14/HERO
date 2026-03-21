import { InjectionToken } from '@angular/core';
import { Score } from '../domain/score.model';

export interface ScoreRepository {
  save(score: Score): Promise<Score>;
  findById(id: string): Promise<Score | null>;
  findByWodAndAthlete(wodId: string, athleteId: string): Promise<Score | null>;
  findByHeat(heatId: string): Promise<Score[]>;
  delete(id: string): Promise<void>;
}

export const SCORE_REPOSITORY = new InjectionToken<ScoreRepository>('SCORE_REPOSITORY');
