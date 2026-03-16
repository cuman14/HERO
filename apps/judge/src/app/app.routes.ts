import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'heat-access',
    pathMatch: 'full',
  },
  {
    path: 'heat-access',
    loadComponent: () =>
      import('./features/heat-access/heat-access.component').then(
        (m) => m.HeatAccessComponent,
      ),
  },
  {
    path: 'heat-confirmation',
    loadComponent: () =>
      import('./features/heat-confirmation/heat-confirmation.component').then(
        (m) => m.HeatConfirmationComponent,
      ),
  },
];
