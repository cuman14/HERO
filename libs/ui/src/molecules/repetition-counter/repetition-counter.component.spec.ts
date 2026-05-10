import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RepetitionCounterComponent } from './repetition-counter.component';

describe('RepetitionCounterComponent', () => {
  let fixture: ComponentFixture<RepetitionCounterComponent>;
  let component: RepetitionCounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepetitionCounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepetitionCounterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', 5);
    fixture.detectChanges();
  });

  it('should display the repetition count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('5');
  });

  it('should emit incremented when increment button is clicked', () => {
    const spy = vi.fn();
    component.incremented.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      '[aria-label="Increment repetition count"]',
    ) as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit decremented when decrement button is clicked', () => {
    const spy = vi.fn();
    component.decremented.subscribe(spy);

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      '[aria-label="Decrement repetition count"]',
    ) as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should disable decrement button when count is 0', () => {
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      '[aria-label="Decrement repetition count"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should disable both buttons when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should show unsaved changes indicator', () => {
    fixture.componentRef.setInput('state', 'unsaved');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Unsaved changes');
  });

  it('should show saved indicator', () => {
    fixture.componentRef.setInput('state', 'saved');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Saved');
  });

  it('should show loading indicator', () => {
    fixture.componentRef.setInput('state', 'loading');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Saving...');
  });

  it('should apply unsaved state classes to count display', () => {
    fixture.componentRef.setInput('state', 'unsaved');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const display = compiled.querySelector('.rounded-3xl') as HTMLElement;
    expect(display.className).toContain('border-amber-400');
  });

  it('should have minimum 48x48px touch targets for buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button.className).toContain('w-14');
      expect(button.className).toContain('h-14');
    });
  });
});
