import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { type HeatConfirmationPayload } from '../../../infrastructure/heat.repository';
import { HeatConfirmationPage } from './heat-confirmation.page';

setupTestBed();

const FIXTURE_PAYLOAD: HeatConfirmationPayload = {
  heat: {
    id: 'heat-test-1',
    code: 'HEAT-A3X9',
    wodName: 'WOD 2: AMRAP 12',
    wodType: 'AMRAP',
    timeCap: '12 min',
    category: 'RX',
    startTime: '14:30h',
    totalAthletes: 5,
    location: 'Box Madrid',
    status: 'pending',
  },
  athletes: [
    {
      id: 'team-001',
      name: 'Box Madrid Alpha',
      bibNumber: '118',
      categoryLabel: 'TEAMS',
      categoryDetail: 'Equipo Mixto RX',
      type: 'team',
      scored: true,
      teamMembers: ['Ana García', 'Luis Pérez'],
    },
    {
      id: 'team-002',
      name: 'CrossFit Sur Beta',
      bibNumber: '122',
      categoryLabel: 'TEAMS',
      categoryDetail: 'Equipo Mixto RX',
      type: 'team',
      scored: false,
      teamMembers: ['María López', 'Juan Martín'],
    },
    {
      id: 'ath-001',
      name: 'Carlos Rodríguez',
      bibNumber: '042',
      categoryLabel: 'RX',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
      scored: false,
    },
    {
      id: 'ath-002',
      name: 'David Ferrer',
      bibNumber: '089',
      categoryLabel: 'RX',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
      scored: false,
    },
    {
      id: 'ath-003',
      name: 'Miguel Ángel Torres',
      bibNumber: '031',
      categoryLabel: 'SCALED',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
      scored: true,
    },
  ],
};

describe('HeatConfirmationPage', () => {
  let fixture: ComponentFixture<HeatConfirmationPage>;
  let component: HeatConfirmationPage;
  let router: Router;

  beforeEach(async () => {
    router = {
      navigate: vi.fn(),
    } as unknown as Router;

    await TestBed.configureTestingModule({
      imports: [HeatConfirmationPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatConfirmationPage);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'router', { value: router });

    fixture.componentRef.setInput('heatPayload', FIXTURE_PAYLOAD);
    fixture.detectChanges();
  });

  it('should render the heat code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('HEAT-A3X9');
  });

  it('should render the WOD name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('WOD 2: AMRAP 12');
  });

  it('should show team athletes by default', () => {
    const athletes = component.filteredAthletes();
    expect(athletes.length).toBe(
      FIXTURE_PAYLOAD.athletes.filter((a) => a.type === 'team').length,
    );
  });

  it('should filter athletes by name search', () => {
    component.onSearch({ target: { value: 'Alpha' } } as unknown as Event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Box Madrid Alpha');
  });

  it('should filter athletes by bib number search', () => {
    component.onSearch({ target: { value: '118' } } as unknown as Event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].bibNumber).toBe('118');
  });

  it('should return empty array when search has no matches', () => {
    component.onSearch({
      target: { value: 'nonexistent123' },
    } as unknown as Event);
    expect(component.filteredAthletes().length).toBe(0);
  });

  it('should navigate scored athlete to summary page', () => {
    const athlete = FIXTURE_PAYLOAD.athletes[0];
    component.onAthleteClick(athlete);

    expect(router.navigate).toHaveBeenCalledWith(
      ['/scoring', athlete.id, 'summary'],
      { queryParams: { readonly: 'true' } },
    );
  });

  it('should navigate non-scored athlete to heat-confirmation-summary', () => {
    const athlete = FIXTURE_PAYLOAD.athletes[1];
    component.onAthleteClick(athlete);

    expect(router.navigate).toHaveBeenCalledWith(
      ['/heat-confirmation-summary'],
      {
        queryParams: {
          heatCode: 'HEAT-A3X9',
          athleteId: athlete.id,
        },
      },
    );
  });

  it('should not render Continuar button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Continuar');
  });

  it('should group athletes by category label and detail', () => {
    fixture.detectChanges();
    const groups = component.groupedAthletes();
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((group) => {
      expect(group.label).toBeTruthy();
      expect(group.athletes.length).toBeGreaterThan(0);
    });
  });
});
