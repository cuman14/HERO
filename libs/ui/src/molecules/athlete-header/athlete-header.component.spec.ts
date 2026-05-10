import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteHeaderComponent } from './athlete-header.component';

describe('AthleteHeaderComponent', () => {
  let fixture: ComponentFixture<AthleteHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AthleteHeaderComponent);
    fixture.componentRef.setInput('athleteName', 'Sarah Johnson');
    fixture.componentRef.setInput('bibNumber', '42');
    fixture.componentRef.setInput('division', 'RX');
    fixture.detectChanges();
  });

  it('should display athlete name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sarah Johnson');
  });

  it('should display bib number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Bib #42');
  });

  it('should display division', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RX');
  });
});
