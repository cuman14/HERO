/**
 * Read-only view of a movement for the score summary screen.
 */
export interface MovementSummaryItem {
  movementId: string;
  name: string;
  roundLabel: string;
  confirmedRepetitions: number;
  targetRepetitions: number;
}
