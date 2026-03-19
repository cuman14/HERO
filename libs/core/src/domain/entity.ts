/**
 * Base Entity class for all domain entities.
 * Provides common identity-based behavior.
 */
export abstract class Entity<T> {
  constructor(
    public readonly id: string,
    protected props: T,
  ) {}

  equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) return false;
    if (!(other instanceof Entity)) return false;
    return this.id === other.id;
  }

  public getProps(): T {
    return { ...this.props };
  }
}
