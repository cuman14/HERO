import { type Route } from '@angular/router';
import { provideScoreFeature } from './score.providers';

const registerRepetitionsPage = () =>
  import('./pages/register-repetitions/register-repetitions.page').then(
    (m) => m.RegisterRepetitionsPage,
  );

const summaryPage = () =>
  import('./pages/summary/summary.page').then((m) => m.SummaryPage);

export const scoreRoutes: Route[] = [
  {
    path: '',
    providers: provideScoreFeature(),
    children: [
      {
        path: '',
        loadComponent: registerRepetitionsPage,
      },
      {
        path: ':heatAthleteId/summary',
        loadComponent: summaryPage,
      },
      {
        path: 'summary',
        loadComponent: summaryPage,
      },
      {
        path: ':heatAthleteId',
        loadComponent: registerRepetitionsPage,
      },
    ],
  },
];
