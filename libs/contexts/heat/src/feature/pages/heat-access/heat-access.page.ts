import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, HeroIconComponent, InputComponent } from '@hero/ui';

@Component({
  selector: 'app-heat-access',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent, HeroIconComponent],
  templateUrl: './heat-access.page.html',
  styles: [
    `
      :host {
        display: block;
        height: 100dvh;
      }
      .split-screen-container {
        height: 100dvh;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class HeatAccessPage {
  private router = inject(Router);

  // Signals for state
  judgeName = signal<string>('');
  heatCode = signal<string>('HEAT-A3X9');
  isSubmitting = signal<boolean>(false);

  updateJudgeName(name: string) {
    this.judgeName.set(name);
  }

  async onSignIn() {
    if (!this.judgeName()) return;

    this.isSubmitting.set(true);
    // TODO: Implement actual sign in logic with use case
    console.log('Signing in with judge name:', this.judgeName());

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.isSubmitting.set(false);
    this.router.navigate(['/heat-confirmation'], {
      queryParams: { heatCode: this.heatCode().trim() },
    });
  }
}
