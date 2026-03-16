import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AthleteCardComponent,
  TabOption,
  TabSwitcherComponent,
  WodInfoCardComponent,
} from '@hero/ui-components';
import {
  MOCK_ATHLETES,
  MOCK_HEAT,
  MOCK_JUDGE,
  MOCK_TEAMS,
  MockAthlete,
} from '../../mock/heat-confirmation.mock';

@Component({
  selector: 'app-heat-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    AthleteCardComponent,
    TabSwitcherComponent,
    WodInfoCardComponent,
  ],
  templateUrl: './heat-confirmation.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100dvh;
      }
    `,
  ],
})
export class HeatConfirmationComponent {
  private router = inject(Router);

  readonly heat = MOCK_HEAT;
  readonly judge = MOCK_JUDGE;

  readonly tabs: TabOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'teams', label: 'Equipos' },
  ];

  activeTab = signal<'individual' | 'teams'>('individual');
  searchQuery = signal<string>('');
  selectedIds = signal<Set<string>>(new Set());
  isContinuing = signal<boolean>(false);

  private allIndividuals = MOCK_ATHLETES;
  private allTeams = MOCK_TEAMS;

  filteredAthletes = computed<MockAthlete[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const source =
      this.activeTab() === 'individual' ? this.allIndividuals : this.allTeams;
    if (!query) return source;
    return source.filter(
      (a) =>
        a.name.toLowerCase().includes(query) || a.bibNumber.includes(query),
    );
  });

  groupedAthletes = computed<{ label: string; athletes: MockAthlete[] }[]>(
    () => {
      const athletes = this.filteredAthletes();
      const map = new Map<string, MockAthlete[]>();
      for (const athlete of athletes) {
        const key = `${athlete.categoryLabel} ${athlete.categoryDetail}`;
        if (!map.has(key)) map.set(key, []);
        const group = map.get(key);
        if (group) group.push(athlete);
      }
      return Array.from(map.entries()).map(([label, list]) => ({
        label,
        athletes: list,
      }));
    },
  );

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelection(id: string): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  onTabChange(value: string): void {
    this.activeTab.set(value as 'individual' | 'teams');
    this.searchQuery.set('');
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  get selectedCount(): number {
    return this.selectedIds().size;
  }

  canContinue = computed<boolean>(() => this.selectedIds().size > 0);

  async onContinue(): Promise<void> {
    if (!this.canContinue()) return;
    this.isContinuing.set(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.isContinuing.set(false);
    this.router.navigate(['/scoring']);
  }

  onBack(): void {
    this.router.navigate(['/heat-access']);
  }
}
