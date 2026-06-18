import { type SessionRecordEntry } from '../domain/repetition-record.model';

const STORAGE_PREFIX = 'hero_scoring_';

export interface SessionScoreState {
  records: SessionRecordEntry[];
  currentMovementIndex: number;
  elapsedSeconds: number;
}

export function saveScoreSession(
  heatAthleteId: string,
  state: SessionScoreState,
): void {
  try {
    sessionStorage.setItem(
      STORAGE_PREFIX + heatAthleteId,
      JSON.stringify(state),
    );
  } catch {
    // sessionStorage may be full or unavailable
  }
}

export function loadScoreSession(
  heatAthleteId: string,
): SessionScoreState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + heatAthleteId);
    if (!raw) return null;
    return JSON.parse(raw) as SessionScoreState;
  } catch {
    return null;
  }
}

export function clearScoreSession(heatAthleteId: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + heatAthleteId);
  } catch {
    // ignore
  }
}
