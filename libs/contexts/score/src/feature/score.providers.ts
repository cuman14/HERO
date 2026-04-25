import { Provider } from '@angular/core';
import { RegisterRepetitionsFacade } from '../application/register-repetitions.facade';

export function provideScoreFeature(): Provider[] {
  return [RegisterRepetitionsFacade];
}
