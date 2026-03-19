import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { type SupabaseConfig, SUPABASE_CONFIG } from './client';
import { supabaseInterceptor } from './supabase.interceptor';

export function provideSupabase(config: SupabaseConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([supabaseInterceptor])),
    { provide: SUPABASE_CONFIG, useValue: config },
  ]);
}
