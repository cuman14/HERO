import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'heat-access',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('@hero/heat').then((m) => m.heatRoutes),
  },
  {
    path: 'scoring',
    loadChildren: () => import('@hero/score').then((m) => m.scoreRoutes),
  },
];
