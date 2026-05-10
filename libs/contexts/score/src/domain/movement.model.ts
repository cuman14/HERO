import { Entity } from '@hero/core';

export interface MovementProps {
  name: string;
  description: string;
  order: number;
  wodId: string;
  targetReps?: number;
}

export class Movement extends Entity<MovementProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get order(): number {
    return this.props.order;
  }

  get wodId(): string {
    return this.props.wodId;
  }

  get targetReps(): number {
    return this.props.targetReps ?? 0;
  }

  static create(id: string, props: MovementProps): Movement {
    if (!props.name.trim()) {
      throw new Error('Movement name cannot be empty');
    }
    if (props.order < 0) {
      throw new Error('Movement order cannot be negative');
    }
    return new Movement(id, props);
  }
}
