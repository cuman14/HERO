import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@hero/core';
import { type PostgrestSingleResponse } from '@supabase/supabase-js';
import { combineLatest, from, map, of, switchMap, type Observable } from 'rxjs';
import {
  HeatConfirmationMapper,
  type HeatAthleteWithRelationsRow,
  type HeatWithRelationsRow,
} from './heat-confirmation.mapper';
import {
  type HeatConfirmationPayload,
  type HeatRepository,
} from './heat.repository';

@Injectable({ providedIn: 'root' })
export class HeatRepositorySupabase implements HeatRepository {
  private readonly supabase = inject(SUPABASE_CLIENT);

  getHeatConfirmationData(params: {
    heatId?: string;
    heatCode?: string;
    judgeId?: string;
  }): Observable<HeatConfirmationPayload | null> {
    return this.fetchHeat(params).pipe(
      switchMap((heatRow) => {
        if (!heatRow) return of(null);

        return combineLatest([
          this.fetchHeatAthletes({
            heatId: heatRow.id,
            judgeId: params.judgeId,
          }),
          this.fetchSubmittedScores(heatRow.id),
        ]).pipe(
          map(([athleteRows, scoresResult]) => {
            const athleteIds = new Set(
              scoresResult
                .filter((s) => s.athlete_id)
                .map((s) => s.athlete_id!),
            );
            const teamIds = new Set(
              scoresResult
                .filter((s) => s.team_id)
                .map((s) => s.team_id!),
            );
            const athletes =
              HeatConfirmationMapper.toAthletesDomain(
                athleteRows,
                athleteIds,
                teamIds,
              );
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
    if (!params.heatId && !params.heatCode) {
      return of(null);
    }

    let query = this.supabase
      .from('heats')
      .select(
        'id,name,status,scheduled_at,wods(id,name,type,base_config,categories(name),events(location))',
      )
      .limit(1);

    if (params.heatId) {
      query = query.eq('id', params.heatId);
    } else if (params.heatCode) {
      query = query.eq('name', params.heatCode);
    }

    return from(query.single()).pipe(
      map(({ data, error }) => {
        if (error) {
          // Supabase throws PGRST116 when no rows are returned from single(), we handle it as null
          if (error.code === 'PGRST116') return null;
          throw error;
        }
        return data as unknown as HeatWithRelationsRow;
      }),
    );
  }

  private fetchSubmittedScores(
    heatId: string,
  ): Observable<{ athlete_id: string | null; team_id: string | null }[]> {
    return from(
      this.supabase
        .from('scores')
        .select('athlete_id, team_id')
        .eq('heat_id', heatId)
        .eq('status', 'submitted'),
    ).pipe(
      map(({ data }) =>
        (data ?? []).map((row) => ({
          athlete_id: row.athlete_id as string | null,
          team_id: row.team_id as string | null,
        })),
      ),
    );
  }

  private fetchHeatAthletes(params: {
    heatId: string;
    judgeId?: string;
  }): Observable<HeatAthleteWithRelationsRow[]> {
    let query = this.supabase
      .from('heat_athletes')
      .select(
        'id,athlete_id,team_id,lane,athletes(id,name,bib_number,box),teams(id,name,bib_number,box,team_members(name))',
      )
      .eq('heat_id', params.heatId)
      .order('lane', { ascending: true, nullsFirst: false });

    if (params.judgeId) {
      query = query.eq('judge_id', params.judgeId);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as unknown as HeatAthleteWithRelationsRow[];
      }),
    );
  }
}
