import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitButtonComponent } from './submit-button.component';

describe('SubmitButtonComponent', () => {
  let fixture: ComponentFixture<SubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitButtonComponent);
    fixture.detectChanges();
  });

  it('should display default text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Submit');
  });

  it('should display custom text', () => {
    fixture.componentRef.setInput('text', 'Save & Continue');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Save & Continue');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('lib-button');
    expect(button).toBeTruthy();
  });

  it('should emit clicked event when button is clicked', (done) => {
    fixture.componentRef.instance.clicked.subscribe(() => {
      done();
    });
    const button = fixture.nativeElement.querySelector('lib-button');
    button.dispatchEvent(new Event('clicked'));
  });
});
