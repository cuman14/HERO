import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '@hero/ui-components';
import { InputComponent } from '@hero/ui-components';
import { HeroIconComponent } from '@hero/ui-components';

@Component({
  selector: 'app-heat-access',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputComponent, HeroIconComponent],
  templateUrl: './heat-access.component.html',
  styles: [`
    :host {
      display: block;
      height: 100dvh;
    }
    .split-screen-container {
      height: 100dvh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class HeatAccessComponent {
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.isSubmitting.set(false);
    // this.router.navigate(['/dashboard']); // Navigate to next step
  }
}
