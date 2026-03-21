import { Injectable, inject } from '@angular/core';
import { type Observable } from 'rxjs';
import {
  HEAT_REPOSITORY,
  type HeatConfirmationPayload,
} from '../infrastructure/heat.repository';

@Injectable()
export class HeatConfirmationFacade {
  private readonly repo = inject(HEAT_REPOSITORY);

  getConfirmationData(params: {
    heatId?: string;
    heatCode?: string;
    judgeId?: string;
  }): Observable<HeatConfirmationPayload | null> {
    return this.repo.getHeatConfirmationData(params);
  }
}
