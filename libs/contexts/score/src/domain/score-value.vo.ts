/**
 * ScoreValue — Value Object
 *
 * Encapsulates score validation based on WOD type.
 * Immutable, compared by value.
 */
export class ScoreValue {
  private constructor(
    public readonly reps: number,
    public readonly time?: number,   // seconds (for FOR_TIME)
    public readonly weight?: number, // kg (for MAX_WEIGHT)
  ) {}

  static fromReps(reps: number): ScoreValue {
    if (reps < 0) throw new Error('Score value cannot be negative');
    return new ScoreValue(reps);
  }

  static fromTime(timeInSeconds: number): ScoreValue {
    if (timeInSeconds <= 0) throw new Error('Time must be positive');
    return new ScoreValue(0, timeInSeconds);
  }

  static fromWeight(weightKg: number): ScoreValue {
    if (weightKg <= 0) throw new Error('Weight must be positive');
    return new ScoreValue(0, undefined, weightKg);
  }

  equals(other: ScoreValue): boolean {
    return (
      this.reps === other.reps &&
      this.time === other.time &&
      this.weight === other.weight
    );
  }
}
