import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WodInfoCardComponent } from './wod-info-card.component';

describe('WodInfoCardComponent', () => {
  let fixture: ComponentFixture<WodInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WodInfoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WodInfoCardComponent);
    fixture.componentRef.setInput('heatCode', 'HEAT-A3X9');
    fixture.componentRef.setInput('wodName', 'WOD 2: AMRAP 12');
    fixture.componentRef.setInput('category', 'RX Masculino');
    fixture.componentRef.setInput('startTime', '14:30h');
    fixture.detectChanges();
  });

  it('should display the heat code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('HEAT-A3X9');
  });

  it('should display the WOD name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('WOD 2: AMRAP 12');
  });

  it('should display the category', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RX Masculino');
  });

  it('should display the start time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('14:30h');
  });

  it('should render timeCap when provided', () => {
    fixture.componentRef.setInput('timeCap', '12 min');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('12 min');
  });

  it('should not render timeCap section when empty', () => {
    fixture.componentRef.setInput('timeCap', '');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Time Cap');
  });
});
