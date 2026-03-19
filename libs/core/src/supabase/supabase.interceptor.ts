import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SUPABASE_CONFIG } from './client';

export const supabaseInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(SUPABASE_CONFIG);
  const isRelative = req.url.startsWith('/');

  if (isRelative) {
    const baseUrl = config.url.replace(/\/$/, '');
    const apiReq = req.clone({
      url: `${baseUrl}/rest/v1${req.url}`,
      setHeaders: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    });
    return next(apiReq);
  }

  return next(req);
};
