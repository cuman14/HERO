/**
 * Central registry of judge-facing business error codes.
 *
 * Format: H00{n} where {n} is a sequential number.
 * Keep codes sorted and documented; new codes must be reviewed by the code owner.
 */
export const BUSINESS_ERROR_CODES = {
  H001: 'Heat assignment not found',
  H002: 'Score could not be saved',
  H003: 'Repetition count could not be saved',
  H004: 'Heat assignment is required to start scoring',
  H005: 'Signature is required to finalize the score',
} as const;

export type BusinessErrorCode = keyof typeof BUSINESS_ERROR_CODES;

/**
 * Returns the human-readable message for a registered business error code.
 * Falls back to a generic message for unknown codes.
 */
export function getBusinessErrorMessage(code: BusinessErrorCode): string {
  return BUSINESS_ERROR_CODES[code] ?? 'Unknown business error';
}
