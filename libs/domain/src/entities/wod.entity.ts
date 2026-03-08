import { Entity } from './entity';

export type WodType = 'AMRAP' | 'FOR_TIME' | 'MAX_WEIGHT' | 'EMOM';

export interface WodProps {
  name: string;
  description: string;
  type: WodType;
  timeCap: number; // seconds
  categoryId: string;
  eventId: string;
  createdAt: Date;
}

export class Wod extends Entity<WodProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get type(): WodType {
    return this.props.type;
  }

  get timeCap(): number {
    return this.props.timeCap;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  static create(
    id: string,
    props: WodProps,
  ): Wod {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Wod name cannot be empty');
    }
    if (props.timeCap <= 0) {
      throw new Error('Time cap must be positive');
    }
    return new Wod(id, props);
  }
}
