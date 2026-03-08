/**
 * ScoringStrategy — Strategy Pattern
 *
 * Each WOD type has its own ranking logic.
 */
export interface ScoringStrategy {
  compare(a: number, b: number): number;
  formatScore(raw: number): string;
}

/** AMRAP: higher reps = better */
export class AmrapStrategy implements ScoringStrategy {
  compare(a: number, b: number): number {
    return b - a; // descending
  }
  formatScore(raw: number): string {
    return `${raw} reps`;
  }
}

/** FOR_TIME: lower time = better */
export class ForTimeStrategy implements ScoringStrategy {
  compare(a: number, b: number): number {
    return a - b; // ascending
  }
  formatScore(raw: number): string {
    const min = Math.floor(raw / 60);
    const sec = raw % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}

/** MAX_WEIGHT: higher weight = better */
export class MaxWeightStrategy implements ScoringStrategy {
  compare(a: number, b: number): number {
    return b - a; // descending
  }
  formatScore(raw: number): string {
    return `${raw} kg`;
  }
}
