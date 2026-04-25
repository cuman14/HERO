export interface AthleteHeatProps {
  athleteId: string;
  athleteName: string;
  bibNumber: string;
  division: string;
  heatId: string;
  heatName: string;
  wodName: string;
  wodType: string;
  lane: number;
}

export class AthleteHeat {
  constructor(private readonly props: AthleteHeatProps) {}

  get athleteId(): string {
    return this.props.athleteId;
  }

  get athleteName(): string {
    return this.props.athleteName;
  }

  get bibNumber(): string {
    return this.props.bibNumber;
  }

  get division(): string {
    return this.props.division;
  }

  get heatId(): string {
    return this.props.heatId;
  }

  get heatName(): string {
    return this.props.heatName;
  }

  get wodName(): string {
    return this.props.wodName;
  }

  get wodType(): string {
    return this.props.wodType;
  }

  get lane(): number {
    return this.props.lane;
  }

  getProps(): AthleteHeatProps {
    return { ...this.props };
  }

  static create(props: AthleteHeatProps): AthleteHeat {
    if (!props.athleteName.trim()) {
      throw new Error('Athlete name cannot be empty');
    }
    return new AthleteHeat(props);
  }
}
