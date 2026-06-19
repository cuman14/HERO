import { describe, expect, it } from 'vitest';
import { BUSINESS_ERROR_CODES } from './error-code.registry';

describe('ErrorCodeRegistry', () => {
  it('contains registered codes', () => {
    expect(BUSINESS_ERROR_CODES.H001).toBe('Heat assignment not found');
    expect(BUSINESS_ERROR_CODES.H002).toBe('Score could not be saved');
  });
});
