import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteCardComponent } from './athlete-card.component';

describe('AthleteCardComponent', () => {
  let fixture: ComponentFixture<AthleteCardComponent>;
  let component: AthleteCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AthleteCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'ath-001');
    fixture.componentRef.setInput('name', 'Carlos Rodríguez');
    fixture.componentRef.setInput('bibNumber', '042');
    fixture.componentRef.setInput('categoryLabel', 'RX');
    fixture.componentRef.setInput('categoryDetail', 'Individual Masculino');
    fixture.detectChanges();
  });

  it('should display athlete name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carlos Rodríguez');
  });

  it('should display bib number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('042');
  });

  it('should display category detail', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Individual Masculino');
  });

  it('should display category badge label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RX');
  });

  it('should show default border when not scored', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('[role="button"]') as HTMLElement;
    expect(card.className).toContain('border-slate-200');
    expect(card.className).not.toContain('border-emerald-300');
  });

  it('should show emerald border when scored is true', () => {
    fixture.componentRef.setInput('scored', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('[role="button"]') as HTMLElement;
    expect(card.className).toContain('border-emerald-300');
  });

  it('should show arrow icon when not scored', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('lib-icon') as HTMLElement;
    expect(icon).not.toBeNull();
  });

  it('should show eye icon when scored', () => {
    fixture.componentRef.setInput('scored', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('lib-icon') as HTMLElement;
    expect(icon).not.toBeNull();
  });

  it('should emit cardClick with athlete id when clicked', () => {
    const spy = vi.fn();
    component.cardClick.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('[role="button"]') as HTMLElement;
    card.click();

    expect(spy).toHaveBeenCalledWith('ath-001');
  });

  it('should emit cardClick on Enter keyup', () => {
    const spy = vi.fn();
    component.cardClick.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('[role="button"]') as HTMLElement;
    card.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }),
    );

    expect(spy).toHaveBeenCalledWith('ath-001');
  });

  it('should render avatar image when avatarUrl is provided', () => {
    fixture.componentRef.setInput(
      'avatarUrl',
      'https://example.com/avatar.png',
    );
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toContain('example.com/avatar.png');
  });

  it('should render fallback initial when no avatarUrl', () => {
    fixture.componentRef.setInput('avatarUrl', '');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img).toBeNull();
    expect(compiled.textContent).toContain('C');
  });

  it('should render team member initials for type=team', () => {
    fixture.componentRef.setInput('type', 'team');
    fixture.componentRef.setInput('teamMembers', [
      { name: 'Ana García' },
      { name: 'Luis Pérez' },
    ]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const teamContainer = compiled.querySelector(
      '.flex.items-center.shrink-0',
    );
    expect(teamContainer).not.toBeNull();
    expect(compiled.textContent).toContain('A');
    expect(compiled.textContent).toContain('L');
  });

  it('should apply TEAMS badge style for categoryLabel TEAMS', () => {
    fixture.componentRef.setInput('categoryLabel', 'TEAMS');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.bg-slate-900') as HTMLElement;
    expect(badge).not.toBeNull();
  });

  it('should apply SCALED badge style for categoryLabel SCALED', () => {
    fixture.componentRef.setInput('categoryLabel', 'SCALED');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.bg-amber-100') as HTMLElement;
    expect(badge).not.toBeNull();
  });
});
