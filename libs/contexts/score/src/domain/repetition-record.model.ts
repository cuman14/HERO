import { Entity } from '@hero/core';

/**
 * RepetitionCount — Value Object
 *
 * Encapsulates a valid repetition count (non-negative integer).
 */
export class RepetitionCount {
  private constructor(public readonly value: number) {}

  static create(count: number): RepetitionCount {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Invalid repetition count: ${count}. Must be a non-negative integer.`);
    }
    return new RepetitionCount(count);
  }

  static zero(): RepetitionCount {
    return new RepetitionCount(0);
  }

  increment(): RepetitionCount {
    return new RepetitionCount(this.value + 1);
  }

  decrement(): RepetitionCount {
    if (this.value === 0) return this;
    return new RepetitionCount(this.value - 1);
  }

  equals(other: RepetitionCount): boolean {
    return this.value === other.value;
  }
}

export interface RepetitionRecordProps {
  movementId: string;
  athleteId: string;
  heatId: string;
  count: RepetitionCount;
  judgeId: string;
  confirmed: boolean;
  createdAt: Date;
}

export class RepetitionRecord extends Entity<RepetitionRecordProps> {
  get movementId(): string {
    return this.props.movementId;
  }

  get athleteId(): string {
    return this.props.athleteId;
  }

  get heatId(): string {
    return this.props.heatId;
  }

  get count(): RepetitionCount {
    return this.props.count;
  }

  get judgeId(): string {
    return this.props.judgeId;
  }

  get confirmed(): boolean {
    return this.props.confirmed;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  updateCount(newCount: RepetitionCount): RepetitionRecord {
    return new RepetitionRecord(this.id, { ...this.props, count: newCount, confirmed: false });
  }

  confirm(): RepetitionRecord {
    return new RepetitionRecord(this.id, { ...this.props, confirmed: true });
  }

  static create(id: string, props: RepetitionRecordProps): RepetitionRecord {
    return new RepetitionRecord(id, props);
  }
}
