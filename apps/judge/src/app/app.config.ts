import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideSupabase } from '@hero/core';
import { appRoutes } from './app.routes';

const env = import.meta.env as Record<string, string | undefined>;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideSupabase({
      url: env['NX_PUBLIC_SUPABASE_URL'] ?? '',
      anonKey: env['NX_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
