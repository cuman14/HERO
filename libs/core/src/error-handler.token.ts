import { inject, InjectionToken } from '@angular/core';

/**
 * App-agnostic error handler interface consumed by the score context.
 *
 * The judge app (or any other host app) provides an implementation that
 * renders the appropriate UI for business and unexpected errors.
 */
export interface ScoreErrorHandler {
  handleError(error: unknown): void;
}

/**
 * Injection token for the score error handler.
 *
 * Host apps should provide an implementation, typically their own global
 * error-handling service. When no handler is provided, errors fall back to
 * the console.
 */
export const SCORE_ERROR_HANDLER = new InjectionToken<ScoreErrorHandler>(
  'score-error-handler',
);

/**
 * Helper to optionally inject the error handler without crashing when the
 * host app has not provided one.
 */
export function injectScoreErrorHandler(): ScoreErrorHandler | null {
  return inject(SCORE_ERROR_HANDLER, { optional: true });
}
