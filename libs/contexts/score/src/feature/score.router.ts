import { type Route } from '@angular/router';
import { provideScoreFeature } from './score.providers';

const registerRepetitionsPage = () =>
  import('./pages/register-repetitions/register-repetitions.page').then(
    (m) => m.RegisterRepetitionsPage,
  );

export const scoreRoutes: Route[] = [
  {
    path: '',
    loadComponent: registerRepetitionsPage,
    providers: provideScoreFeature(),
  },
  {
    path: ':heatAthleteId',
    loadComponent: registerRepetitionsPage,
    providers: provideScoreFeature(),
  },
];
