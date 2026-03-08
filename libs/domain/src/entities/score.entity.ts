import { ScoreValue } from '../value-objects/score-value.vo';
import { Entity } from './entity';

export interface ScoreProps {
  wodId: string;
  athleteId: string;
  value: ScoreValue;
  penaltyReps: number;
  judgeId: string;
  confirmed: boolean;
  createdAt: Date;
}

export class Score extends Entity<ScoreProps> {
  get wodId(): string {
    return this.props.wodId;
  }

  get athleteId(): string {
    return this.props.athleteId;
  }

  get value(): ScoreValue {
    return this.props.value;
  }

  get penaltyReps(): number {
    return this.props.penaltyReps;
  }

  get judgeId(): string {
    return this.props.judgeId;
  }

  get confirmed(): boolean {
    return this.props.confirmed;
  }

  get effectiveReps(): number {
    return this.props.value.reps - this.props.penaltyReps;
  }

  confirm(): Score {
    return new Score(this.id, { ...this.props, confirmed: true });
  }

  static create(id: string, props: ScoreProps): Score {
    if (props.penaltyReps < 0) {
      throw new Error('Penalty reps cannot be negative');
    }
    return new Score(id, props);
  }
}
