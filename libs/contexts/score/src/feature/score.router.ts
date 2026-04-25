import { type Route } from '@angular/router';

export const scoreRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/register-repetitions/register-repetitions.page').then(
        (m) => m.RegisterRepetitionsPage,
      ),
  },
];
