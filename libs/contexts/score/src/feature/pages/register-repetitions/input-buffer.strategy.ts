/**
 * PATTERN: Strategy
 * REASON: Encapsulates the numeric input buffer behaviour (digit append, backspace, reset)
 *         into a standalone injectable class. The page component delegates all buffer
 *         management here, keeping event handlers as thin orchestrators.
 *         Enables unit testing of input logic without instantiating an Angular component.
 * ALTERNATIVE CONSIDERED: Private signal + methods inline in the page — rejected because
 *   it mixes UI event handling with buffer state management in the same class.
 */
import { Injectable, signal } from '@angular/core';

const MAX_BUFFER_LENGTH = 3;
const EMPTY_BUFFER = '0';

@Injectable()
export class InputBufferStrategy {
  private readonly buffer = signal(EMPTY_BUFFER);

  appendDigit(digit: string, maxReps: number): number | null {
    const current = this.buffer();
    const next = current === EMPTY_BUFFER ? digit : current + digit;

    if (next.length > MAX_BUFFER_LENGTH) return null;

    const parsedValue = parseInt(next, 10);
    if (parsedValue > maxReps) return null;

    this.buffer.set(next);
    return isNaN(parsedValue) ? null : parsedValue;
  }

  removeLastDigit(): number {
    const current = this.buffer();
    const next = current.length > 1 ? current.slice(0, -1) : EMPTY_BUFFER;
    this.buffer.set(next);
    const parsedValue = parseInt(next, 10);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  reset(): void {
    this.buffer.set(EMPTY_BUFFER);
  }
}
