import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorModalComponent } from './core/error-handling/error-modal.component';
import { ErrorHandlingService } from './core/error-handling/error-handling.service';

@Component({
  imports: [RouterModule, ErrorModalComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly errorHandling = inject(ErrorHandlingService);
  protected title = 'judge';
}
