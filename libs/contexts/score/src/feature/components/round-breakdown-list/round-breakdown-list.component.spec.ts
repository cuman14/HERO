import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { TestBed } from '@angular/core/testing';
import { type MovementSummaryItem } from '../../../domain/movement-summary-item.model';
import { RoundBreakdownListComponent } from './round-breakdown-list.component';

function mockItems(): MovementSummaryItem[] {
  return [
    {
      movementId: 'm1',
      name: 'Thrusters',
      roundLabel: 'Round 1',
      confirmedRepetitions: 21,
      targetRepetitions: 21,
    },
    {
      movementId: 'm2',
      name: 'Pull-ups',
      roundLabel: 'Round 2',
      confirmedRepetitions: 15,
      targetRepetitions: 21,
    },
  ];
}

setupTestBed();

describe('RoundBreakdownListComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render heading', () => {
    TestBed.configureTestingModule({
      imports: [RoundBreakdownListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RoundBreakdownListComponent);
    fixture.componentRef.setInput('heading', 'AMRAP Breakdown');
    fixture.componentRef.setInput('items', mockItems());
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('AMRAP Breakdown');
  });

  it('should render default heading when not provided', () => {
    TestBed.configureTestingModule({
      imports: [RoundBreakdownListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RoundBreakdownListComponent);
    fixture.componentRef.setInput('items', mockItems());
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('Desglose por Rondas');
  });

  it('should render each item with its round label', () => {
    TestBed.configureTestingModule({
      imports: [RoundBreakdownListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RoundBreakdownListComponent);
    fixture.componentRef.setInput('items', mockItems());
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('Round 1');
    expect(html).toContain('Round 2');
  });

  it('should render confirmed / target repetitions', () => {
    TestBed.configureTestingModule({
      imports: [RoundBreakdownListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RoundBreakdownListComponent);
    fixture.componentRef.setInput('items', mockItems());
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent as string;
    expect(html).toContain('21 / 21');
    expect(html).toContain('15 / 21');
  });

  it('should render nothing when items are empty', () => {
    TestBed.configureTestingModule({
      imports: [RoundBreakdownListComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RoundBreakdownListComponent);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('[class*="flex justify-between"]');
    expect(rows.length).toBe(0);
  });
});
