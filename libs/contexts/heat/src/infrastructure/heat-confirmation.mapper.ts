import {
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
} from '../domain/heat-confirmation.model';
import { type Json, type Tables } from '@hero/types';

type HeatRow = Tables<'heats'>;
type HeatAthleteRow = Tables<'heat_athletes'>;
type AthleteRow = Tables<'athletes'>;
type TeamRow = Tables<'teams'>;
type WodRow = Tables<'wods'>;
type EventRow = Tables<'events'>;
type CategoryRow = Tables<'categories'>;
type TeamMemberRow = Tables<'team_members'>;

export type HeatWithRelationsRow = Pick<
  HeatRow,
  'id' | 'name' | 'status' | 'scheduled_at'
> & {
  wods:
    | (Pick<WodRow, 'id' | 'name' | 'type' | 'base_config'> & {
        categories: Pick<CategoryRow, 'name'> | null;
        events: Pick<EventRow, 'location'> | null;
      })
    | null;
};

export type HeatAthleteWithRelationsRow = Pick<
  HeatAthleteRow,
  'athlete_id' | 'team_id' | 'lane'
> & {
  athletes: Pick<AthleteRow, 'id' | 'name' | 'bib_number' | 'box'> | null;
  teams:
    | (Pick<TeamRow, 'id' | 'name' | 'bib_number' | 'box'> & {
        team_members: Pick<TeamMemberRow, 'name'>[] | null;
      })
    | null;
};

const HEAT_STATUS_MAP: Record<
  HeatRow['status'],
  HeatConfirmationHeat['status']
> = {
  pending: 'pending',
  active: 'in_progress',
  finished: 'completed',
};

export class HeatConfirmationMapper {
  static toHeatDomain(
    row: HeatWithRelationsRow,
    totalAthletes: number,
  ): HeatConfirmationHeat {
    const baseConfig = HeatConfirmationMapper.asJsonRecord(row.wods?.base_config);
    const timeCapMinutes = HeatConfirmationMapper.readTimeCapMinutes(baseConfig);

    return {
      id: row.id,
      code: row.name,
      wodName: row.wods?.name ?? 'WOD',
      wodType: (row.wods?.type ?? 'amrap').toUpperCase(),
      timeCap: timeCapMinutes ? `${timeCapMinutes} min` : 'N/A',
      category: row.wods?.categories?.name ?? 'Sin categoría',
      startTime: HeatConfirmationMapper.formatStartTime(row.scheduled_at),
      totalAthletes,
      location: row.wods?.events?.location ?? 'Sin ubicación',
      status: HEAT_STATUS_MAP[row.status],
    };
  }

  static toAthletesDomain(
    rows: HeatAthleteWithRelationsRow[],
  ): HeatConfirmationAthlete[] {
    const teamsById = new Map<string, HeatConfirmationAthlete>();
    const individuals: HeatConfirmationAthlete[] = [];

    for (const row of rows) {
      if (row.team_id && row.teams) {
        if (!teamsById.has(row.team_id)) {
          teamsById.set(row.team_id, {
            id: row.teams.id,
            name: row.teams.name,
            bibNumber: row.teams.bib_number ?? '-',
            categoryLabel: 'TEAMS',
            categoryDetail: 'Equipo',
            type: 'team',
            teamMembers:
              row.teams.team_members?.map((member) => member.name) ?? [],
          });
        }
        continue;
      }

      if (!row.athletes) continue;

      individuals.push({
        id: row.athletes.id,
        name: row.athletes.name,
        bibNumber: row.athletes.bib_number ?? '-',
        categoryLabel: 'RX',
        categoryDetail: 'Individual',
        type: 'individual',
      });
    }

    return [...teamsById.values(), ...individuals];
  }

  private static asJsonRecord(
    value: Json | null | undefined,
  ): Record<string, Json> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return value as Record<string, Json>;
  }

  private static readTimeCapMinutes(
    config: Record<string, Json>,
  ): number | null {
    const candidates = [
      config['time_cap_minutes'],
      config['timeCapMinutes'],
      config['time_cap'],
      config['timeCap'],
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate;
      }
      if (typeof candidate === 'string') {
        const parsed = Number(candidate);
        if (Number.isFinite(parsed)) return parsed;
      }
    }

    return null;
  }

  private static formatStartTime(value: string | null): string {
    if (!value) return 'Sin hora';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sin hora';
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}h`;
  }
}
