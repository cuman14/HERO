/**
 * BibNumber — Value Object
 *
 * Ensures valid athlete bib number format.
 */
export class BibNumber {
  private constructor(public readonly value: string) {}

  static create(raw: string): BibNumber {
    const trimmed = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]{1,6}$/.test(trimmed)) {
      throw new Error(`Invalid bib number: "${raw}". Must be 1-6 alphanumeric characters.`);
    }
    return new BibNumber(trimmed);
  }

  equals(other: BibNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
