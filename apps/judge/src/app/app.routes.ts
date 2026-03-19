import { Route } from '@angular/router';
import { heatConfirmationResolver, provideHeatContext } from '@hero/heat';

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
    resolve: { heatPayload: heatConfirmationResolver },
    providers: provideHeatContext(),
    loadComponent: () =>
      import('./features/heat-confirmation/heat-confirmation.component').then(
        (m) => m.HeatConfirmationComponent,
      ),
  },
];
