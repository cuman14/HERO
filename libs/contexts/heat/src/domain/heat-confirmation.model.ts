export type HeatCardStatus = 'pending' | 'in_progress' | 'completed';

export interface HeatConfirmationHeat {
  id: string;
  code: string;
  wodName: string;
  wodType: string;
  timeCap: string;
  category: string;
  startTime: string;
  totalAthletes: number;
  location: string;
  status: HeatCardStatus;
}

export type AthleteCategoryLabel = 'RX' | 'SCALED' | 'TEAMS' | 'MASTERS';

export interface HeatConfirmationAthlete {
  id: string;
  name: string;
  bibNumber: string;
  categoryLabel: AthleteCategoryLabel;
  categoryDetail: string;
  type: 'individual' | 'team';
  avatarUrl?: string;
  teamMembers?: string[];
}
