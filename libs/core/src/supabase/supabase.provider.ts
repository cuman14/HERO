import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { type SupabaseConfig, SUPABASE_CLIENT } from './client';

export function provideSupabase(config: SupabaseConfig): EnvironmentProviders {
  const supabaseClient = createClient(config.url, config.anonKey);

  return makeEnvironmentProviders([
    { provide: SUPABASE_CLIENT, useValue: supabaseClient },
  ]);
}
