import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementStackCardComponent, MovementStackItem } from './movement-stack-card.component';
import { MovementHeaderComponent } from './movement-header.component';

describe('MovementStackCardComponent', () => {
  let fixture: ComponentFixture<MovementStackCardComponent>;

  const createCompletedItems = (count: number): MovementStackItem[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `movement-${i + 1}`,
      name: `Movement ${i + 1}`,
      description: 'Test movement',
      targetReps: 10,
      currentReps: 10,
      status: 'completed' as const,
      roundLabel: `Round ${i + 1}`,
      roundIndex: i,
    }));

  const createActiveItem = (): MovementStackItem => ({
    id: 'active-1',
    name: 'Active Movement',
    description: 'Test active',
    targetReps: 20,
    currentReps: 5,
    status: 'active' as const,
    roundLabel: 'Round 1',
    roundIndex: 0,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementStackCardComponent, MovementHeaderComponent],
    }).compileComponents();
  });

  it('should create component with expanded signal false by default', () => {
    fixture = TestBed.createComponent(MovementStackCardComponent);
    fixture.componentRef.setInput('items', [createActiveItem()]);
    fixture.componentRef.setInput('elapsedSeconds', 0);
    fixture.detectChanges();

    expect(fixture.componentInstance.expanded()).toBe(false);
  });

  describe('toggleExpanded', () => {
    it('should toggle expanded from false to true', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(2), createActiveItem()]);
      fixture.detectChanges();

      fixture.componentInstance.toggleExpanded();
      expect(fixture.componentInstance.expanded()).toBe(true);

      fixture.componentInstance.toggleExpanded();
      expect(fixture.componentInstance.expanded()).toBe(false);
    });
  });

  describe('accordion header visibility', () => {
    it('should not show toggle button when no completed items', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('button[aria-label="Toggle completed movements list"]');
      expect(toggleButton).toBeNull();
    });

    it('should show toggle button when completed items exist', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(1), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('button[aria-label="Toggle completed movements list"]');
      expect(toggleButton).not.toBeNull();
    });
  });

  describe('expanded list rendering', () => {
    it('should render all completed items in list when expanded', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(3), createActiveItem()]);
      fixture.detectChanges();

      fixture.componentInstance.expanded.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('#completedList .flex.items-center.gap-3');
      expect(listItems.length).toBe(3);

      expect(compiled.textContent).toContain('Movement 1');
      expect(compiled.textContent).toContain('Movement 2');
      expect(compiled.textContent).toContain('Movement 3');
    });

    it('should show reps and round label for each completed item', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      const items = [
        { ...createCompletedItems(1)[0], name: 'Thrusters', targetReps: 15, currentReps: 15, roundLabel: 'Round 1' },
        createActiveItem(),
      ];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      fixture.componentInstance.expanded.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('15 / 15 reps');
      expect(compiled.textContent).toContain('Round 1');
    });
  });

  describe('stacked cards visibility', () => {
    it('should show stacked cards when collapsed and completed items exist', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(2), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const stackedCards = compiled.querySelectorAll('.card-to-stack1, .card-to-stack2');
      expect(stackedCards.length).toBe(2);
    });

    it('should hide stacked cards when expanded', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(2), createActiveItem()]);
      fixture.detectChanges();

      fixture.componentInstance.expanded.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const stackedCards = compiled.querySelectorAll('.card-to-stack1, .card-to-stack2');
      expect(stackedCards.length).toBe(0);
    });
  });

  describe('ARIA attributes', () => {
    it('should have correct aria-expanded on toggle button', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(1), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('button[aria-label="Toggle completed movements list"]') as HTMLButtonElement;
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');

      fixture.componentInstance.expanded.set(true);
      fixture.detectChanges();

      expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-controls pointing to completedList', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(1), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('button[aria-label="Toggle completed movements list"]') as HTMLButtonElement;
      expect(toggleButton.getAttribute('aria-controls')).toBe('completedList');
    });

    it('should have role button and tabindex', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(1), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('button[aria-label="Toggle completed movements list"]') as HTMLButtonElement;
      expect(toggleButton).not.toBeNull();
    });
  });

  describe('chevron rotation', () => {
    it('should have rotate-180 class when expanded', () => {
      fixture = TestBed.createComponent(MovementStackCardComponent);
      fixture.componentRef.setInput('items', [...createCompletedItems(1), createActiveItem()]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const chevron = compiled.querySelector('button[aria-label="Toggle completed movements list"] lib-icon');
      expect(chevron?.classList.contains('rotate-180')).toBe(false);

      fixture.componentInstance.expanded.set(true);
      fixture.detectChanges();

      expect(chevron?.classList.contains('rotate-180')).toBe(true);
    });
  });
});