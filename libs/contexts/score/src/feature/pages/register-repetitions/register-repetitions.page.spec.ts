import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi, type Mocked } from 'vitest';
import { RegisterRepetitionsFacade } from '../../../application/register-repetitions.facade';
import { InputBufferStrategy } from './input-buffer.strategy';
import { RegisterRepetitionsPage } from './register-repetitions.page';

function createMockFacade(
  overrides: Partial<ReturnType<typeof createMockFacade>> = {},
) {
  const facade = {
    athleteHeat: signal(null),
    movements: signal([]),
    currentMovementIndex: signal(0),
    currentRepetitionCount: signal({ value: 0 }),
    currentMovement: signal(null),
    totalReps: signal(0),
    canNavigateNext: signal(false),
    loadHeat: vi.fn(),
    updateRepetitionCount: vi.fn(),
    incrementRepetitionCount: vi.fn(),
    decrementRepetitionCount: vi.fn(),
    submitRepetitionCount: vi.fn(),
    recordElapsedTime: vi.fn(),
    navigateNext: vi.fn(),
    ...overrides,
  };
  return facade;
}

function createMockInputBuffer(
  overrides: Partial<ReturnType<typeof createMockInputBuffer>> = {},
) {
  return {
    appendDigit: vi.fn().mockReturnValue(null),
    removeLastDigit: vi.fn().mockReturnValue(0),
    reset: vi.fn(),
    ...overrides,
  };
}

interface TestContext {
  fixture: ComponentFixture<RegisterRepetitionsPage>;
  component: RegisterRepetitionsPage;
  router: Mocked<Router>;
  route: Mocked<ActivatedRoute>;
  facade: ReturnType<typeof createMockFacade>;
  inputBuffer: ReturnType<typeof createMockInputBuffer>;
}

async function setup(
  overrides: {
    facade?: ReturnType<typeof createMockFacade>;
    inputBuffer?: ReturnType<typeof createMockInputBuffer>;
    heatAthleteId?: string;
  } = {},
): Promise<TestContext> {
  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  } as unknown as Mocked<Router>;

  const route = {} as unknown as Mocked<ActivatedRoute>;

  const facade = overrides.facade ?? createMockFacade();
  const inputBuffer = overrides.inputBuffer ?? createMockInputBuffer();

  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [RegisterRepetitionsPage],
    providers: [
      { provide: RegisterRepetitionsFacade, useValue: facade },
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: route },
    ],
  })
    .overrideComponent(RegisterRepetitionsPage, {
      set: { providers: [{ provide: InputBufferStrategy, useValue: inputBuffer }] },
    })
    .compileComponents();

  const fixture = TestBed.createComponent(RegisterRepetitionsPage);
  const component = fixture.componentInstance;
  component.heatAthleteId = overrides.heatAthleteId;

  return { fixture, component, router, route, facade, inputBuffer };
}

setupTestBed();

describe('RegisterRepetitionsPage', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should redirect to /heat-access when heatAthleteId is missing', async () => {
    const { fixture, component, router, facade } = await setup();

    component.ngOnInit();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/heat-access']);
    expect(facade.loadHeat).not.toHaveBeenCalled();
  });

  it('should load heat when heatAthleteId is provided', async () => {
    const { component, facade } = await setup({
      heatAthleteId: 'ha-test',
    });

    component.ngOnInit();

    expect(facade.loadHeat).toHaveBeenCalledWith('ha-test');
    expect(facade.loadHeat).toHaveBeenCalledTimes(1);
  });

  it('should append digit through input buffer and update count', async () => {
    const inputBuffer = createMockInputBuffer({
      appendDigit: vi.fn().mockReturnValue(12),
    });
    const { component, facade } = await setup({
      heatAthleteId: 'ha-test',
      inputBuffer,
    });

    component.onDigit('1');

    expect(inputBuffer.appendDigit).toHaveBeenCalledWith('1', 999);
    expect(facade.updateRepetitionCount).toHaveBeenCalledWith(12);
  });

  it('should handle backspace and update count', async () => {
    const inputBuffer = createMockInputBuffer({
      removeLastDigit: vi.fn().mockReturnValue(5),
    });
    const { component, facade } = await setup({
      heatAthleteId: 'ha-test',
      inputBuffer,
    });

    component.onBackspace();

    expect(inputBuffer.removeLastDigit).toHaveBeenCalled();
    expect(facade.updateRepetitionCount).toHaveBeenCalledWith(5);
  });

  it('should submit repetition count on confirm and reset buffer', async () => {
    const { component, facade, inputBuffer } = await setup({
      heatAthleteId: 'ha-test',
    });

    component.onConfirm();

    expect(facade.submitRepetitionCount).toHaveBeenCalled();
    expect(inputBuffer.reset).toHaveBeenCalled();
  });

  it('should navigate to summary after confirming the last movement', async () => {
    const facade = createMockFacade({
      canNavigateNext: signal(false),
    });
    const { component, router, facade: facadeRef } = await setup({
      heatAthleteId: 'ha-test',
      facade,
    });

    component.ngOnInit();
    component.elapsedSeconds.set(125);
    component.onConfirm();

    expect(facadeRef.recordElapsedTime).toHaveBeenCalledWith(125);
    expect(router.navigate).toHaveBeenCalledWith(['summary'], {
      relativeTo: expect.any(Object),
    });
  });
});
