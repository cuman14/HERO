import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementCardComponent } from './movement-card.component';

describe('MovementCardComponent', () => {
  let fixture: ComponentFixture<MovementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementCardComponent);
    fixture.componentRef.setInput('name', 'Thrusters');
    fixture.componentRef.setInput('description', '21-15-9 reps at 95 lb');
    fixture.detectChanges();
  });

  it('should display movement name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Thrusters');
  });

  it('should display movement description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('21-15-9 reps at 95 lb');
  });

  it('should have rounded card styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('div');
    expect(card?.className).toContain('rounded-3xl');
  });
});
