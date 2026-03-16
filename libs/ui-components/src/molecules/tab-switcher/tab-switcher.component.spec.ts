import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabOption, TabSwitcherComponent } from './tab-switcher.component';

const TABS: TabOption[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'teams', label: 'Equipos' },
];

describe('TabSwitcherComponent', () => {
  let fixture: ComponentFixture<TabSwitcherComponent>;
  let component: TabSwitcherComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabSwitcherComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', TABS);
    fixture.componentRef.setInput('activeValue', 'individual');
    fixture.detectChanges();
  });

  it('should render all tab labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('Individual');
    expect(buttons[1].textContent?.trim()).toBe('Equipos');
  });

  it('should apply active styles to the active tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstBtn = compiled.querySelectorAll('button')[0];
    expect(firstBtn.className).toContain('bg-white');
    expect(firstBtn.className).toContain('text-slate-900');
  });

  it('should apply inactive styles to non-active tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const secondBtn = compiled.querySelectorAll('button')[1];
    expect(secondBtn.className).toContain('text-slate-500');
  });

  it('should emit tabChange when a tab is clicked', () => {
    const spy = vi.fn();
    component.tabChange.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const secondBtn = compiled.querySelectorAll('button')[1] as HTMLButtonElement;
    secondBtn.click();

    expect(spy).toHaveBeenCalledWith('teams');
  });

  it('should not emit tabChange for already active tab click', () => {
    const spy = vi.fn();
    component.tabChange.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const firstBtn = compiled.querySelectorAll('button')[0] as HTMLButtonElement;
    firstBtn.click();

    expect(spy).toHaveBeenCalledWith('individual');
  });
});
