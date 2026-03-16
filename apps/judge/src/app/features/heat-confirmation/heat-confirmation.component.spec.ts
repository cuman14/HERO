import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeatConfirmationComponent } from './heat-confirmation.component';
import { MOCK_ATHLETES, MOCK_TEAMS } from '../../mock/heat-confirmation.mock';

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

  it('should render judge name in footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('User_88');
  });

  it('should default to individual tab', () => {
    expect(component.activeTab()).toBe('individual');
  });

  it('should switch to teams tab on tabChange', () => {
    component.onTabChange('teams');
    expect(component.activeTab()).toBe('teams');
  });

  it('should show individual athletes by default', () => {
    const athletes = component.filteredAthletes();
    expect(athletes.length).toBe(MOCK_ATHLETES.length);
  });

  it('should show team athletes when teams tab is active', () => {
    component.onTabChange('teams');
    const athletes = component.filteredAthletes();
    expect(athletes.length).toBe(MOCK_TEAMS.length);
  });

  it('should filter athletes by name search', () => {
    const event = { target: { value: 'Carlos' } } as unknown as Event;
    component.onSearch(event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Carlos Rodríguez');
  });

  it('should filter athletes by bib number search', () => {
    const event = { target: { value: '089' } } as unknown as Event;
    component.onSearch(event);
    const filtered = component.filteredAthletes();
    expect(filtered.length).toBe(1);
    expect(filtered[0].bibNumber).toBe('089');
  });

  it('should return empty array when search has no matches', () => {
    const event = { target: { value: 'zzznomatch' } } as unknown as Event;
    component.onSearch(event);
    expect(component.filteredAthletes().length).toBe(0);
  });

  it('should reset search when switching tabs', () => {
    const event = { target: { value: 'Carlos' } } as unknown as Event;
    component.onSearch(event);
    expect(component.searchQuery()).toBe('Carlos');
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

  it('should track multiple selections independently', () => {
    component.toggleSelection('ath-001');
    component.toggleSelection('ath-002');
    expect(component.selectedCount).toBe(2);
    expect(component.isSelected('ath-001')).toBe(true);
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
    const groups = component.groupedAthletes();
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((group) => {
      expect(group.label).toBeTruthy();
      expect(group.athletes.length).toBeGreaterThan(0);
    });
  });
});
