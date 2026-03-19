import { inject } from '@angular/core';
import { type ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HeatConfirmationFacade } from '../application/heat-confirmation.facade';
import { type HeatConfirmationPayload } from '../infrastructure/heat.repository';

export const heatConfirmationResolver: ResolveFn<HeatConfirmationPayload | null> = (route) => {
  const facade = inject(HeatConfirmationFacade);
  const heatCode = route.queryParamMap.get('heatCode') ?? undefined;

  return facade.getConfirmationData({ heatCode }).pipe(
    catchError(() => of(null)),
  );
};
