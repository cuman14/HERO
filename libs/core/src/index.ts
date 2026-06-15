// Core Public API
export { Entity } from './domain/entity';
export { SUPABASE_CLIENT, type SupabaseConfig } from './supabase/client';
export { provideSupabase } from './supabase/supabase.provider';
export {
  SCORE_ERROR_HANDLER,
  injectScoreErrorHandler,
  type ScoreErrorHandler,
} from './error-handler.token';
