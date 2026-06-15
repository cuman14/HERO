import { Injectable, signal } from '@angular/core';
import { type ScoreErrorHandler } from '@hero/core';
import {
  BusinessErrorCode,
  getBusinessErrorMessage,
} from './error-code.registry';

/**
 * Business error shape used by application code to surface domain failures.
 */
export interface BusinessError {
  code: BusinessErrorCode;
  message: string;
}

/**
 * Public state of the error modal. Components render the modal from this signal.
 */
export interface ErrorModalState {
  visible: boolean;
  title: string;
  message: string;
  actionLabel: string;
}

/**
 * App-wide error handling service.
 *
 * Distinguishes between:
 * - Business errors (H00{n}) → show code + message
 * - HTTP 500 / unexpected errors → show generic modal
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlingService implements ScoreErrorHandler {
  readonly modalState = signal<ErrorModalState>({
    visible: false,
    title: '',
    message: '',
    actionLabel: 'Accept',
  });

  /**
   * Analyzes an error and shows the appropriate modal.
   */
  showError(error: unknown): void {
    if (isBusinessError(error)) {
      this.showBusinessError(error);
      return;
    }

    if (isHttp500Error(error)) {
      this.showGenericError();
      return;
    }

    this.showGenericError();
  }

  /**
   * Creates a business error object from a registered code.
   */
  businessError(code: BusinessErrorCode): BusinessError {
    return { code, message: getBusinessErrorMessage(code) };
  }

  /**
   * Hides the error modal.
   */
  dismiss(): void {
    this.modalState.update((state) => ({ ...state, visible: false }));
  }

  /**
   * Alias for {@link showError} so the service satisfies the
   * {@link ScoreErrorHandler} interface consumed by the score context.
   */
  handleError(error: unknown): void {
    this.showError(error);
  }

  private showBusinessError(error: BusinessError): void {
    this.modalState.set({
      visible: true,
      title: 'Error',
      message: `${error.code}: ${error.message}`,
      actionLabel: 'Accept',
    });
  }

  private showGenericError(): void {
    this.modalState.set({
      visible: true,
      title: 'Something went wrong',
      message:
        'An unexpected error occurred. Please try again or contact support.',
      actionLabel: 'Accept',
    });
  }
}

function isBusinessError(error: unknown): error is BusinessError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as BusinessError).code === 'string' &&
    (error as BusinessError).code.match(/^H00\d+$/) !== null &&
    'message' in error &&
    typeof (error as BusinessError).message === 'string'
  );
}

function isHttp500Error(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;

  const status = (error as { status?: unknown }).status;
  if (typeof status === 'number') {
    return status >= 500 && status < 600;
  }

  const statusCode = (error as { statusCode?: unknown }).statusCode;
  if (typeof statusCode === 'number') {
    return statusCode >= 500 && statusCode < 600;
  }

  return false;
}
