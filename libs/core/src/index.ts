// Core Public API
export { Entity } from './domain/entity';
export { RestClient, SUPABASE_CONFIG, type SupabaseConfig } from './supabase/client';
export { supabaseInterceptor } from './supabase/supabase.interceptor';
export { provideSupabase } from './supabase/supabase.provider';
