import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'lib-submit-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <lib-button
      variant="primary"
      size="lg"
      [disabled]="disabled()"
      [loading]="loading()"
      (clicked)="clicked.emit()"
    >
      @if (loading()) {
        {{ loadingText() }}
      } @else {
        {{ text() }}
      }
    </lib-button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SubmitButtonComponent {
  text = input<string>('Submit');
  loadingText = input<string>('Saving...');
  disabled = input(false);
  loading = input(false);

  clicked = output<void>();
}
