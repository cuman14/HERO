import { Injectable, signal } from '@angular/core';
import { type ScoreErrorHandler } from '@hero/core';
import { type BusinessErrorCode } from './error-code.registry';

export interface BusinessError {
  code: BusinessErrorCode;
  message: string;
}

export interface ErrorModalState {
  visible: boolean;
  title: string;
  message: string;
  actionLabel: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService implements ScoreErrorHandler {
  readonly modalState = signal<ErrorModalState>({
    visible: false,
    title: '',
    message: '',
    actionLabel: 'Accept',
  });

  handleError(error: unknown): void {
    if (isBusinessError(error)) {
      this.modalState.set({
        visible: true,
        title: 'Error',
        message: `${error.code}: ${error.message}`,
        actionLabel: 'Accept',
      });
    } else {
      this.modalState.set({
        visible: true,
        title: 'Something went wrong',
        message:
          'An unexpected error occurred. Please try again or contact support.',
        actionLabel: 'Accept',
      });
    }
  }

  dismiss(): void {
    this.modalState.update((state) => ({ ...state, visible: false }));
  }
}

function isBusinessError(error: unknown): error is BusinessError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as BusinessError).code === 'string' &&
    'message' in error &&
    typeof (error as BusinessError).message === 'string'
  );
}
