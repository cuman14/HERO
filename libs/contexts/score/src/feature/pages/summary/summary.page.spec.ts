import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed, DeferBlockState } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi, type Mocked } from 'vitest';
import { AthleteHeat } from '../../../domain/athlete-heat.model';
import { type MovementSummaryItem } from '../../../domain/movement-summary-item.model';
import { SCORE_ERROR_HANDLER } from '@hero/core';
import { RegisterRepetitionsFacade } from '../../../application/register-repetitions.facade';
import { SummaryPage } from './summary.page';

function mockAthleteHeat(): AthleteHeat {
  return AthleteHeat.create({
    athleteId: 'athlete-001',
    athleteName: 'Carlos Rodríguez',
    bibNumber: '23',
    division: 'RX Masculino',
    heatId: 'heat-001',
    heatName: 'Heat 1A',
    wodName: 'Fran',
    wodType: 'FOR_TIME',
    lane: 1,
  });
}

function mockMovementSummaryItems(): MovementSummaryItem[] {
  return [
    {
      movementId: 'm1',
      name: 'Thrusters',
      roundLabel: 'Round 1',
      confirmedRepetitions: 21,
      targetRepetitions: 21,
    },
    {
      movementId: 'm2',
      name: 'Pull-ups',
      roundLabel: 'Round 2',
      confirmedRepetitions: 21,
      targetRepetitions: 21,
    },
  ];
}

function createMockFacade(
  overrides: Partial<ReturnType<typeof createMockFacade>> = {},
) {
  const errorSignal = signal<string | null>(null);
  const facade = {
    athleteHeat: signal(mockAthleteHeat()),
    totalReps: signal(142),
    elapsedSeconds: signal(734),
    movementSummaryItems: signal(mockMovementSummaryItems()),
    isLoading: signal(false),
    isSubmitting: signal(false),
    error: errorSignal,
    loadHeat: vi.fn(),
    finalizeScore: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  return facade;
}

interface TestContext {
  fixture: ComponentFixture<SummaryPage>;
  component: SummaryPage;
  router: Mocked<Router>;
  location: Mocked<Location>;
  facade: ReturnType<typeof createMockFacade>;
}

function mockRoute(
  params: Record<string, string> = {},
  queryParams: Record<string, string> = {},
): ActivatedRoute {
  return { snapshot: { params, queryParams } } as unknown as ActivatedRoute;
}

async function setup(overrides: {
  facade?: ReturnType<typeof createMockFacade>;
  routeParams?: Record<string, string>;
  queryParams?: Record<string, string>;
} = {}): Promise<TestContext> {
  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  } as unknown as Mocked<Router>;

  const location = {
    back: vi.fn(),
  } as unknown as Mocked<Location>;

  const facade = overrides.facade ?? createMockFacade();

  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [SummaryPage],
    providers: [
      provideRouter([]),
      { provide: RegisterRepetitionsFacade, useValue: facade },
      {
        provide: ActivatedRoute,
        useValue: mockRoute(overrides.routeParams, overrides.queryParams),
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(SummaryPage);
  const component = fixture.componentInstance;

  Object.defineProperty(component, 'router', {
    value: router,
    configurable: true,
  });
  Object.defineProperty(component, 'location', {
    value: location,
    configurable: true,
  });

  return { fixture, component, router, location, facade };
}

setupTestBed();

describe('SummaryPage', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should redirect to /heat-access when athleteHeat is null', async () => {
    const emptyFacade = createMockFacade({
      athleteHeat: signal(null),
      movementSummaryItems: signal([]),
    });
    const { fixture, router } = await setup({ facade: emptyFacade });

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/heat-access']);
  });

  it('should render athlete name and BIB', async () => {
    const { component, fixture } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('Carlos Rodríguez');
    expect(html).toContain('#23');
  });

  it('should render total reps and elapsed time', async () => {
    const { component, fixture } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();
    const deferBlocks = await fixture.getDeferBlocks();
    await deferBlocks[0].render(DeferBlockState.Complete);
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('142 REPS');
    expect(html).toContain('12:14');
  });

  it('should render movement breakdown', async () => {
    const { component, fixture } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();
    const deferBlocks = await fixture.getDeferBlocks();
    await deferBlocks[1].render(DeferBlockState.Complete);
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('Round 1');
    expect(html).toContain('Round 2');
    expect(html).toContain('21 / 21');
  });

  it('should not submit without signature', async () => {
    const { component, fixture, router, facade } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();

    await component.onSubmit();
    expect(facade.finalizeScore).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should submit with signature and navigate to /heat-confirmation', async () => {
    const { component, fixture, router, facade } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();

    component.onSignature('test-sig');
    await component.onSubmit();

    expect(facade.finalizeScore).toHaveBeenCalledWith('test-sig');
    expect(router.navigate).toHaveBeenCalledWith(['/heat-confirmation'], { queryParams: { heatCode: 'Heat 1A' } });
  });

  it('should stay on page when finalizeScore fails', async () => {
    const failingFacade = createMockFacade();
    failingFacade.finalizeScore = vi.fn().mockRejectedValue(new Error('Network error'));

    const { component, fixture, router } = await setup({ facade: failingFacade, routeParams: { heatAthleteId: 'ha-001' } });

    component.ngOnInit();
    fixture.detectChanges();

    component.onSignature('test-sig');
    await component.onSubmit();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call the error handler when finalizeScore fails', async () => {
    const errorHandler = { handleError: vi.fn() };
    const failingFacade = createMockFacade();
    failingFacade.finalizeScore = vi.fn().mockRejectedValue(new Error('Network error'));

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SummaryPage],
      providers: [
        provideRouter([]),
        { provide: RegisterRepetitionsFacade, useValue: failingFacade },
        { provide: SCORE_ERROR_HANDLER, useValue: errorHandler },
        { provide: ActivatedRoute, useValue: mockRoute() },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SummaryPage);
    const component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();

    component.onSignature('test-sig');
    await component.onSubmit();

    expect(errorHandler.handleError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should go back when onEdit is called', async () => {
    const { component, location } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

    component.onEdit();
    expect(location.back).toHaveBeenCalled();
  });

  describe('read-only mode', () => {
    it('should enter read-only mode when readonly query param is set', async () => {
      const loadHeat = vi.fn();
      const emptyFacade = createMockFacade({
        athleteHeat: signal(null),
        movementSummaryItems: signal([]),
        loadHeat,
      });
      const { component } = await setup({
        facade: emptyFacade,
        routeParams: { heatAthleteId: 'ha-001' },
        queryParams: { readonly: 'true' },
      });

      component.ngOnInit();

      expect(component.isReadOnly()).toBe(true);
    });

    it('should not enter read-only mode by default', async () => {
      const { component } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

      component.ngOnInit();

      expect(component.isReadOnly()).toBe(false);
    });

    it('should navigate to /scoring/:id on onEdit in read-only mode', async () => {
      const emptyFacade = createMockFacade({
        athleteHeat: signal(null),
        movementSummaryItems: signal([]),
      });
      const { component, router } = await setup({
        facade: emptyFacade,
        routeParams: { heatAthleteId: 'ha-001' },
      });

      component.ngOnInit();
      component.isReadOnly.set(true);
      component.onEdit();

      expect(router.navigate).toHaveBeenCalledWith(['/scoring', 'ha-001']);
    });

    it('should navigate to /heat-confirmation on onBack', async () => {
      const { component, router } = await setup({ routeParams: { heatAthleteId: 'ha-001' } });

      component.ngOnInit();
      component.onBack();

      expect(router.navigate).toHaveBeenCalledWith(['/heat-confirmation'], {
        queryParams: { heatCode: 'Heat 1A' },
      });
    });

  });
});
