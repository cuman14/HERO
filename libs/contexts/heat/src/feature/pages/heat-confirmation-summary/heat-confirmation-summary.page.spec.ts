import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi, type Mocked } from 'vitest';
import { HeatConfirmationPayload } from '../../../infrastructure/heat.repository';
import { HeatConfirmationSummaryPage } from './heat-confirmation-summary.page';

describe('HeatConfirmationSummaryPage', () => {
  let component: HeatConfirmationSummaryPage;
  let fixture: ComponentFixture<HeatConfirmationSummaryPage>;
  let router: Mocked<Router>;
  let location: Mocked<Location>;

  const mockPayload: HeatConfirmationPayload = {
    heat: {
      id: 'h1',
      code: 'HEAT-001',
      wodName: 'WOD 1',
      wodType: 'AMRAP',
      timeCap: '12 min',
      category: 'RX',
      startTime: '10:00',
      totalAthletes: 10,
      location: 'Main Floor',
      status: 'pending',
    },
    athletes: [
      {
        id: 'a1',
        name: 'John Doe',
        bibNumber: '001',
        categoryLabel: 'RX',
        categoryDetail: 'Individual',
        type: 'individual',
      },
    ],
  };

  const setupTest = (state?: unknown, historyState?: unknown) => {
    router = {
      getCurrentNavigation: vi.fn().mockReturnValue({
        extras: { state },
      }),
      navigate: vi.fn(),
    } as unknown as Mocked<Router>;

    location = {
      getState: vi.fn().mockReturnValue(historyState),
      back: vi.fn(),
    } as unknown as Mocked<Location>;

    TestBed.configureTestingModule({
      imports: [HeatConfirmationSummaryPage],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(HeatConfirmationSummaryPage);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'router', { value: router });
    Object.defineProperty(component, 'location', { value: location });
  };

  it('should initialize with router state', () => {
    setupTest({ heatPayload: mockPayload, selectedAthleteId: 'a1' });
    fixture.detectChanges();

    expect(component.heatPayload()).toEqual(mockPayload);
    expect(component.selectedAthleteId()).toBe('a1');
    expect(component.athlete()?.id).toBe('a1');
    expect(component.heat()?.code).toBe('HEAT-001');
  });

  it('should fallback to location history state if no router state', () => {
    setupTest(undefined, { heatPayload: mockPayload, selectedAthleteId: 'a1' });
    fixture.detectChanges();

    expect(component.heatPayload()).toEqual(mockPayload);
    expect(component.selectedAthleteId()).toBe('a1');
  });

  it('should redirect to heat-access if no state is provided', () => {
    setupTest();
    fixture.detectChanges(); // triggers ngOnInit

    expect(router.navigate).toHaveBeenCalledWith(['/heat-access'], {
      replaceUrl: true,
    });
  });

  it('should redirect to heat-access if missing selectedAthleteId', () => {
    setupTest({ heatPayload: mockPayload });
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/heat-access'], {
      replaceUrl: true,
    });
  });

  it('should navigate to scoring on confirm', () => {
    setupTest({ heatPayload: mockPayload, selectedAthleteId: 'a1' });
    fixture.detectChanges();

    component.onConfirm();

    expect(component.isConfirming()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/scoring']);
  });

  it('should not navigate to scoring if data is incomplete', () => {
    setupTest({ heatPayload: mockPayload, selectedAthleteId: 'invalid-id' });
    fixture.detectChanges();

    component.onConfirm();

    expect(component.isConfirming()).toBe(false);
    expect(router.navigate).not.toHaveBeenCalledWith(['/scoring']);
  });

  it('should navigate back on back button click', () => {
    setupTest({ heatPayload: mockPayload, selectedAthleteId: 'a1' });
    fixture.detectChanges();

    component.onBack();

    expect(location.back).toHaveBeenCalled();
  });
});
