import { inject } from '@angular/core';
import { type ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HeatConfirmationFacade } from '../../application/heat-confirmation.facade';
import { type HeatConfirmationPayload } from '../../infrastructure/heat.repository';

export interface HeatConfirmationSummaryData {
  heatPayload: HeatConfirmationPayload | null;
  selectedAthleteId: string | null;
}

export const heatConfirmationSummaryResolver: ResolveFn<HeatConfirmationSummaryData> = (route) => {
  const facade = inject(HeatConfirmationFacade);
  const heatCode = route.queryParamMap.get('heatCode') ?? undefined;
  const selectedAthleteId = route.queryParamMap.get('athleteId') ?? null;

  // If we have a heatCode, fetch the data
  if (heatCode) {
    return facade.getConfirmationData({ heatCode }).pipe(
      catchError(() => of(null)),
    ).pipe(
      map((payload) => ({
        heatPayload: payload,
        selectedAthleteId,
      }))
    );
  }

  // Otherwise return empty data - component will redirect
  return of({
    heatPayload: null,
    selectedAthleteId,
  });
};

// Helper for map operator
import { map } from 'rxjs/operators';
