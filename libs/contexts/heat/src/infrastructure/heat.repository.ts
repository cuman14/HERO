import { InjectionToken } from '@angular/core';
import { type Observable } from 'rxjs';
import {
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
} from '../domain/heat-confirmation.model';

export interface HeatConfirmationPayload {
  heat: HeatConfirmationHeat;
  athletes: HeatConfirmationAthlete[];
}

export interface HeatRepository {
  getHeatConfirmationData(params: {
    heatId?: string;
    heatCode?: string;
    judgeId?: string;
  }): Observable<HeatConfirmationPayload | null>;
}

export const HEAT_REPOSITORY = new InjectionToken<HeatRepository>('HEAT_REPOSITORY');
