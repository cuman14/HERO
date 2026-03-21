import { type Route } from '@angular/router';
import { provideHeatContext } from './heat.providers';
import { heatConfirmationResolver } from './resolvers/heat-confirmation.resolver';

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
      {
        path: 'heat-confirmation-summary',
        loadComponent: () =>
          import(
            './pages/heat-confirmation-summary/heat-confirmation-summary.page'
          ).then((m) => m.HeatConfirmationSummaryPage),
      },
    ],
  },
];
