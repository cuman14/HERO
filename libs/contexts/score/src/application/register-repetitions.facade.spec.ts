import { RegisterRepetitionsFacade } from './register-repetitions.facade';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('RegisterRepetitionsFacade', () => {
  let facade: RegisterRepetitionsFacade;

  beforeEach(() => {
    facade = new RegisterRepetitionsFacade();
  });

  describe('loadHeat', () => {
    it('should set loading to true initially', () => {
      facade.loadHeat();
      expect(facade.isLoading()).toBe(true);
    });

    it('should load mock data after delay', async () => {
      facade.loadHeat();
      await delay(500);
      expect(facade.athleteHeat()).not.toBeNull();
      expect(facade.movements().length).toBeGreaterThan(0);
      expect(facade.isLoading()).toBe(false);
    });
  });

  describe('repetition count operations', () => {
    beforeEach(async () => {
      facade.loadHeat();
      await delay(500);
    });

    it('should increment repetition count', () => {
      expect(facade.currentRepetitionCount().value).toBe(0);
      facade.incrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(1);
    });

    it('should decrement repetition count', () => {
      facade.incrementRepetitionCount();
      facade.incrementRepetitionCount();
      facade.decrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(1);
    });

    it('should not decrement below zero', () => {
      facade.decrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(0);
    });

    it('should update repetition count directly', () => {
      facade.updateRepetitionCount(15);
      expect(facade.currentRepetitionCount().value).toBe(15);
    });

    it('should set error for invalid count', () => {
      facade.updateRepetitionCount(-5);
      expect(facade.error()).toBe('Invalid repetition count');
    });
  });

  describe('submission', () => {
    beforeEach(async () => {
      facade.loadHeat();
      await delay(500);
    });

    it('should set submitting state', () => {
      facade.incrementRepetitionCount();
      facade.submitRepetitionCount();
      expect(facade.isSubmitting()).toBe(true);
    });

    it('should confirm record after submission', async () => {
      facade.incrementRepetitionCount();
      expect(facade.hasUnsavedChanges()).toBe(true);
      facade.submitRepetitionCount();
      await delay(400);
      expect(facade.hasUnsavedChanges()).toBe(false);
      expect(facade.isSubmitting()).toBe(false);
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      facade.loadHeat();
      await delay(500);
    });

    it('should navigate to next movement', () => {
      facade.navigateNext();
      expect(facade.currentMovementIndex()).toBe(1);
    });

    it('should navigate to previous movement', () => {
      facade.navigateNext();
      facade.navigatePrevious();
      expect(facade.currentMovementIndex()).toBe(0);
    });

    it('should navigate to specific movement', () => {
      facade.navigateToMovement(2);
      expect(facade.currentMovementIndex()).toBe(2);
    });

    it('should report movement progress', () => {
      expect(facade.movementProgress()).toMatch(/1 \/ \d+/);
    });
  });
});
