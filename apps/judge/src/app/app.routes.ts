import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/heat-access/heat-access.component').then(m => m.HeatAccessComponent)
  },
  {
    path: 'heat-access',
    loadComponent: () => import('./features/heat-access/heat-access.component').then(m => m.HeatAccessComponent)
  }
];
