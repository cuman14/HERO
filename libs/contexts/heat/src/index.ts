// Heat Context Public API

// Domain
export {
  type AthleteCategoryLabel,
  type HeatCardStatus,
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
} from './domain/heat-confirmation.model';

// Infrastructure
export {
  HEAT_REPOSITORY,
  type HeatConfirmationPayload,
  type HeatRepository,
} from './infrastructure/heat.repository';

// Application
export { HeatConfirmationFacade } from './application/heat-confirmation.facade';

// Feature
export { provideHeatContext } from './feature/heat.providers';
export { heatRoutes } from './feature/heat.routes';
export { heatConfirmationResolver } from './feature/resolvers/heat-confirmation.resolver';
