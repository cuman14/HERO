import { type Route } from '@angular/router';
import { heatConfirmationResolver } from './resolvers/heat-confirmation.resolver';
import { provideHeatContext } from './heat.providers';

export const heatRoutes: Route[] = [
  {
    path: '',
    providers: provideHeatContext(),
    children: [
      {
        path: 'heat-access',
        loadComponent: () =>
          import('./pages/heat-access/heat-access.page').then(
            (m) => m.HeatAccessPage,
          ),
      },
      {
        path: 'heat-confirmation',
        resolve: { heatPayload: heatConfirmationResolver },
        loadComponent: () =>
          import('./pages/heat-confirmation/heat-confirmation.page').then(
            (m) => m.HeatConfirmationPage,
          ),
      },
    ],
  },
];
