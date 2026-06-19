export const BUSINESS_ERROR_CODES = {
  H001: 'Heat assignment not found',
  H002: 'Score could not be saved',
  H003: 'Repetition count could not be saved',
  H004: 'Heat assignment is required to start scoring',
  H005: 'Signature is required to finalize the score',
} as const;

export type BusinessErrorCode = keyof typeof BUSINESS_ERROR_CODES;
