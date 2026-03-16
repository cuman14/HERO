export type AthleteType = 'individual' | 'team';
export type CategoryLabel = 'RX' | 'SCALED' | 'TEAMS' | 'MASTERS';

export interface MockAthlete {
  id: string;
  name: string;
  bibNumber: string;
  categoryLabel: CategoryLabel;
  categoryDetail: string;
  type: AthleteType;
  avatarUrl?: string;
  teamMembers?: string[];
}

export interface MockHeat {
  code: string;
  wodName: string;
  wodType: string;
  timeCap: string;
  category: string;
  startTime: string;
  totalAthletes: number;
  location: string;
}

export interface MockJudge {
  id: string;
  name: string;
}

export const MOCK_HEAT: MockHeat = {
  code: 'HEAT-A3X9',
  wodName: 'WOD 2: AMRAP 12',
  wodType: 'AMRAP',
  timeCap: '12 min',
  category: 'RX Masculino',
  startTime: '14:30h',
  totalAthletes: 8,
  location: 'Box Madrid',
};

export const MOCK_JUDGE: MockJudge = {
  id: 'judge-88',
  name: 'User_88',
};

export const MOCK_ATHLETES: MockAthlete[] = [
  {
    id: 'ath-001',
    name: 'Carlos Rodríguez',
    bibNumber: '042',
    categoryLabel: 'RX',
    categoryDetail: 'Individual Masculino',
    type: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  },
  {
    id: 'ath-002',
    name: 'David Ferrer',
    bibNumber: '089',
    categoryLabel: 'RX',
    categoryDetail: 'Individual Masculino',
    type: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    id: 'ath-003',
    name: 'Miguel Ángel Torres',
    bibNumber: '031',
    categoryLabel: 'RX',
    categoryDetail: 'Individual Masculino',
    type: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
  },
  {
    id: 'ath-004',
    name: 'Álvaro Navarro',
    bibNumber: '057',
    categoryLabel: 'SCALED',
    categoryDetail: 'Individual Masculino',
    type: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alvaro',
  },
  {
    id: 'ath-005',
    name: 'Javier Morales',
    bibNumber: '074',
    categoryLabel: 'SCALED',
    categoryDetail: 'Individual Masculino',
    type: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Javier',
  },
];

export const MOCK_TEAMS: MockAthlete[] = [
  {
    id: 'team-001',
    name: 'Box Madrid Alpha',
    bibNumber: '118',
    categoryLabel: 'TEAMS',
    categoryDetail: 'Equipo Mixto RX',
    type: 'team',
    teamMembers: ['Ana García', 'Luis Pérez', 'Sara Romero', 'Pedro Jiménez'],
  },
  {
    id: 'team-002',
    name: 'CrossFit Sur Beta',
    bibNumber: '122',
    categoryLabel: 'TEAMS',
    categoryDetail: 'Equipo Mixto RX',
    type: 'team',
    teamMembers: ['María López', 'Juan Martín', 'Elena Castro', 'Roberto Díaz'],
  },
  {
    id: 'team-003',
    name: 'Box Norte Gamma',
    bibNumber: '135',
    categoryLabel: 'TEAMS',
    categoryDetail: 'Equipo Mixto Scaled',
    type: 'team',
    teamMembers: ['Isabel Ruiz', 'Antonio Sanz', 'Carmen Vega', 'Diego Mora'],
  },
];
