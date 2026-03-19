import { Injectable, inject } from '@angular/core';
import { map, of, switchMap, type Observable } from 'rxjs';
import { RestClient } from '@hero/core';
import { type HeatConfirmationPayload, type HeatRepository } from './heat.repository';
import {
  HeatConfirmationMapper,
  type HeatAthleteWithRelationsRow,
  type HeatWithRelationsRow,
} from './heat-confirmation.mapper';

@Injectable({ providedIn: 'root' })
export class HeatRepositorySupabase implements HeatRepository {
  private readonly restClient = inject(RestClient);

  getHeatConfirmationData(params: {
    heatId?: string;
    heatCode?: string;
    judgeId?: string;
  }): Observable<HeatConfirmationPayload | null> {
    return this.fetchHeat(params).pipe(
      switchMap((heatRow) => {
        if (!heatRow) return of(null);

        return this.fetchHeatAthletes({
          heatId: heatRow.id,
          judgeId: params.judgeId,
        }).pipe(
          map((athleteRows) => {
            const athletes =
              HeatConfirmationMapper.toAthletesDomain(athleteRows);
            return {
              heat: HeatConfirmationMapper.toHeatDomain(
                heatRow,
                athletes.length,
              ),
              athletes,
            };
          }),
        );
      }),
    );
  }

  private fetchHeat(params: {
    heatId?: string;
    heatCode?: string;
  }): Observable<HeatWithRelationsRow | null> {
    const filters: string[] = [
      'select=id,name,status,scheduled_at,wods(id,name,type,base_config,categories(name),events(location))',
    ];

    if (params.heatId) {
      filters.push(`id=eq.${encodeURIComponent(params.heatId)}`);
    } else if (params.heatCode) {
      filters.push(`name=eq.${encodeURIComponent(params.heatCode)}`);
    } else {
      return of(null);
    }

    filters.push('limit=1');

    return this.restClient
      .get<HeatWithRelationsRow[]>(`/heats?${filters.join('&')}`)
      .pipe(map((rows) => rows[0] ?? null));
  }

  private fetchHeatAthletes(params: {
    heatId: string;
    judgeId?: string;
  }): Observable<HeatAthleteWithRelationsRow[]> {
    const filters: string[] = [
      'select=athlete_id,team_id,lane,athletes(id,name,bib_number,box),teams(id,name,bib_number,box,team_members(name))',
      `heat_id=eq.${encodeURIComponent(params.heatId)}`,
      'order=lane.asc.nullslast',
    ];

    if (params.judgeId) {
      filters.push(`judge_id=eq.${encodeURIComponent(params.judgeId)}`);
    }

    return this.restClient.get<HeatAthleteWithRelationsRow[]>(
      `/heat_athletes?${filters.join('&')}`,
    );
  }
}
