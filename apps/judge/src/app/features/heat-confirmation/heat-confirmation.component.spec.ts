import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { type HeatConfirmationPayload } from '@hero/heat';
import { HeatConfirmationComponent } from './heat-confirmation.component';

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
      teamMembers: ['Ana García', 'Luis Pérez'],
    },
    {
      id: 'team-002',
      name: 'CrossFit Sur Beta',
      bibNumber: '122',
      categoryLabel: 'TEAMS',
      categoryDetail: 'Equipo Mixto RX',
      type: 'team',
      teamMembers: ['María López', 'Juan Martín'],
    },
    {
      id: 'ath-001',
      name: 'Carlos Rodríguez',
      bibNumber: '042',
      categoryLabel: 'RX',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
    },
    {
      id: 'ath-002',
      name: 'David Ferrer',
      bibNumber: '089',
      categoryLabel: 'RX',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
    },
    {
      id: 'ath-003',
      name: 'Miguel Ángel Torres',
      bibNumber: '031',
      categoryLabel: 'SCALED',
      categoryDetail: 'Individual Masculino',
      type: 'individual',
    },
  ],
};

describe('HeatConfirmationComponent', () => {
  let fixture: ComponentFixture<HeatConfirmationComponent>;
  let component: HeatConfirmationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatConfirmationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatConfirmationComponent);
    component = fixture.componentInstance;
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

  it('should render judge label in footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Juez:');
  });

  it('should default to teams tab', () => {
    expect(component.activeTab()).toBe('teams');
  });

  it('should switch to individual tab on tabChange', () => {
    component.onTabChange('individual');
    expect(component.activeTab()).toBe('individual');
  });

  it('should show team athletes by default', () => {
    const athletes = component.filteredAthletes();
    expect(athletes.length).toBe(
      FIXTURE_PAYLOAD.athletes.filter((a) => a.type === 'team').length,
    );
  });

  it('should show individual athletes when individual tab is active', () => {
    component.onTabChange('individual');
    const athletes = component.filteredAthletes();
    expect(athletes.length).toBe(
      FIXTURE_PAYLOAD.athletes.filter((a) => a.type === 'individual').length,
    );
  });

  it('should filter athletes by name search', () => {
    component.onTabChange('individual');
    component.onSearch({ target: { value: 'Carlos' } } as unknown as Event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Carlos Rodríguez');
  });

  it('should filter athletes by bib number search', () => {
    component.onTabChange('individual');
    component.onSearch({ target: { value: '089' } } as unknown as Event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].bibNumber).toBe('089');
  });

  it('should return empty array when search has no matches', () => {
    component.onSearch({
      target: { value: 'nonexistent123' },
    } as unknown as Event);
    expect(component.filteredAthletes().length).toBe(0);
  });

  it('should reset search when switching tabs', () => {
    component.onSearch({ target: { value: 'Carlos' } } as unknown as Event);
    component.onTabChange('teams');
    expect(component.searchQuery()).toBe('');
  });

  it('should start with no selected athletes', () => {
    expect(component.selectedCount).toBe(0);
  });

  it('should toggle athlete selection on', () => {
    component.toggleSelection('ath-001');
    expect(component.isSelected('ath-001')).toBe(true);
    expect(component.selectedCount).toBe(1);
  });

  it('should toggle athlete selection off when already selected', () => {
    component.toggleSelection('ath-001');
    component.toggleSelection('ath-001');
    expect(component.isSelected('ath-001')).toBe(false);
    expect(component.selectedCount).toBe(0);
  });

  it('should track single selection only', () => {
    component.toggleSelection('ath-001');
    component.toggleSelection('ath-002');
    expect(component.selectedCount).toBe(1);
    expect(component.isSelected('ath-001')).toBe(false);
    expect(component.isSelected('ath-002')).toBe(true);
  });

  it('should disable continue when no athletes are selected', () => {
    expect(component.canContinue()).toBe(false);
  });

  it('should enable continue when at least one athlete is selected', () => {
    component.toggleSelection('ath-001');
    expect(component.canContinue()).toBe(true);
  });

  it('should group athletes by category label and detail', () => {
    component.onTabChange('individual');
    fixture.detectChanges();
    const groups = component.groupedAthletes();
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((group) => {
      expect(group.label).toBeTruthy();
      expect(group.athletes.length).toBeGreaterThan(0);
    });
  });
});
