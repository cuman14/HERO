import { type Provider } from '@angular/core';
import { HEAT_REPOSITORY } from '../infrastructure/heat.repository';
import { HeatRepositorySupabase } from '../infrastructure/heat.repository.supabase';
import { HeatConfirmationFacade } from '../application/heat-confirmation.facade';

export function provideHeatContext(): Provider[] {
  return [
    { provide: HEAT_REPOSITORY, useExisting: HeatRepositorySupabase },
    HeatConfirmationFacade,
  ];
}
