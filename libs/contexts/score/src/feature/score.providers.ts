import { Provider } from '@angular/core';
import { SUPABASE_CLIENT } from '@hero/core';
import { type SupabaseClient } from '@supabase/supabase-js';
import { RegisterRepetitionsFacade } from '../application/register-repetitions.facade';
import { MOVEMENT_REPOSITORY } from '../infrastructure/movement.repository';
import { SupabaseMovementRepository } from '../infrastructure/movement.repository.supabase';
import { REPETITION_RECORD_REPOSITORY } from '../infrastructure/repetition-record.repository';
import { SupabaseRepetitionRecordRepository } from '../infrastructure/repetition-record.repository.supabase';

export function provideScoreFeature(): Provider[] {
  return [
    RegisterRepetitionsFacade,
    {
      provide: MOVEMENT_REPOSITORY,
      useFactory: (supabase: SupabaseClient) =>
        new SupabaseMovementRepository(supabase),
      deps: [SUPABASE_CLIENT],
    },
    {
      provide: REPETITION_RECORD_REPOSITORY,
      useFactory: (supabase: SupabaseClient) =>
        new SupabaseRepetitionRecordRepository(supabase),
      deps: [SUPABASE_CLIENT],
    },
  ];
}
