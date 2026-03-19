import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { type Observable } from 'rxjs';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>(
  'SUPABASE_CONFIG',
);

@Injectable({ providedIn: 'root' })
export class RestClient {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(normalizedPath);
  }
}
