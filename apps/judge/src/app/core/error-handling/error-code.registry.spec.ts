import { describe, expect, it } from 'vitest';
import {
  BUSINESS_ERROR_CODES,
  type BusinessErrorCode,
  getBusinessErrorMessage,
} from './error-code.registry';

describe('ErrorCodeRegistry', () => {
  it('contains registered codes', () => {
    expect(BUSINESS_ERROR_CODES.H001).toBe('Heat assignment not found');
    expect(BUSINESS_ERROR_CODES.H002).toBe('Score could not be saved');
  });

  it('returns message for a registered code', () => {
    expect(getBusinessErrorMessage('H001')).toBe('Heat assignment not found');
  });

  it('returns fallback for an unknown code', () => {
    expect(
      getBusinessErrorMessage('H999' as unknown as BusinessErrorCode),
    ).toBe('Unknown business error');
  });
});
