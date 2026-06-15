import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideSupabase, SCORE_ERROR_HANDLER } from '@hero/core';
import { ErrorHandlingService } from './core/error-handling/error-handling.service';
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
    ErrorHandlingService,
    { provide: SCORE_ERROR_HANDLER, useExisting: ErrorHandlingService },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
