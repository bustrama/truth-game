import { describe, it, expect } from 'vitest';
import { isEligible, eligibleQuestions, buildDeck } from '../filter';
import type { Intake, Question } from '../types';
import { QUESTIONS } from '../questions';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q_test',
    text: 'בדיקה',
    category: 'fun',
    intensity: 1,
    directedAt: 'self',
    sensitive: false,
    audience: {
      adultOnly: false,
      statuses: 'any',
      kids: 'any',
      playMode: 'any',
    },
    ...overrides,
  };
}

function makeIntake(overrides: Partial<Intake> = {}): Intake {
  return {
    isAdult: true,
    relationshipStatus: 'dating',
    hasKids: false,
    playMode: 'couple',
    ...overrides,
  };
}

describe('isEligible', () => {
  it('passes a neutral question for a neutral intake', () => {
    expect(isEligible(makeQuestion(), makeIntake())).toBe(true);
  });

  describe('age gate', () => {
    it('excludes adultOnly questions for minors', () => {
      const q = makeQuestion({
        audience: { adultOnly: true, statuses: 'any', kids: 'any', playMode: 'any' },
      });
      expect(isEligible(q, makeIntake({ isAdult: false }))).toBe(false);
      expect(isEligible(q, makeIntake({ isAdult: true }))).toBe(true);
    });
  });

  describe('minor-safety floor', () => {
    it('excludes intensity >= 4 for minors regardless of category', () => {
      const q = makeQuestion({ intensity: 4, category: 'deep' });
      expect(isEligible(q, makeIntake({ isAdult: false }))).toBe(false);
    });
    it('excludes intimacy category for minors regardless of intensity', () => {
      const q = makeQuestion({
        category: 'intimacy',
        intensity: 1,
        audience: { adultOnly: false, statuses: 'any', kids: 'any', playMode: 'couple' },
      });
      expect(isEligible(q, makeIntake({ isAdult: false }))).toBe(false);
    });
    it('allows intensity 3 for minors', () => {
      const q = makeQuestion({ intensity: 3, category: 'values' });
      expect(isEligible(q, makeIntake({ isAdult: false }))).toBe(true);
    });
  });

  describe('relationship status', () => {
    it('excludes when status not in the allowed list', () => {
      const q = makeQuestion({
        audience: { adultOnly: false, statuses: ['married'], kids: 'any', playMode: 'any' },
      });
      expect(isEligible(q, makeIntake({ relationshipStatus: 'single' }))).toBe(false);
      expect(isEligible(q, makeIntake({ relationshipStatus: 'married' }))).toBe(true);
    });
  });

  describe('kids', () => {
    it('hasKids questions require a parent', () => {
      const q = makeQuestion({
        audience: { adultOnly: false, statuses: 'any', kids: 'hasKids', playMode: 'any' },
      });
      expect(isEligible(q, makeIntake({ hasKids: false }))).toBe(false);
      expect(isEligible(q, makeIntake({ hasKids: true }))).toBe(true);
    });
    it('noKids questions exclude parents', () => {
      const q = makeQuestion({
        audience: { adultOnly: false, statuses: 'any', kids: 'noKids', playMode: 'any' },
      });
      expect(isEligible(q, makeIntake({ hasKids: true }))).toBe(false);
      expect(isEligible(q, makeIntake({ hasKids: false }))).toBe(true);
    });
  });

  describe('play mode', () => {
    it('couple-only questions excluded in friends mode', () => {
      const q = makeQuestion({
        audience: { adultOnly: false, statuses: 'any', kids: 'any', playMode: 'couple' },
      });
      expect(isEligible(q, makeIntake({ playMode: 'friends' }))).toBe(false);
      expect(isEligible(q, makeIntake({ playMode: 'couple' }))).toBe(true);
    });
  });

  describe('partner-directed ⇒ couple', () => {
    it('excludes partner/both questions in friends mode', () => {
      const partner = makeQuestion({
        directedAt: 'partner',
        audience: { adultOnly: false, statuses: 'any', kids: 'any', playMode: 'couple' },
      });
      const both = makeQuestion({
        directedAt: 'both',
        audience: { adultOnly: false, statuses: 'any', kids: 'any', playMode: 'couple' },
      });
      expect(isEligible(partner, makeIntake({ playMode: 'friends' }))).toBe(false);
      expect(isEligible(both, makeIntake({ playMode: 'friends' }))).toBe(false);
      expect(isEligible(partner, makeIntake({ playMode: 'couple' }))).toBe(true);
    });
  });

  describe('skipSensitive', () => {
    it('drops sensitive questions only when toggled', () => {
      const q = makeQuestion({ sensitive: true });
      expect(isEligible(q, makeIntake({ skipSensitive: true }))).toBe(false);
      expect(isEligible(q, makeIntake({ skipSensitive: false }))).toBe(true);
      expect(isEligible(q, makeIntake())).toBe(true);
    });
  });
});

describe('corpus integration', () => {
  it('a minor never receives intimacy or intensity>=4 questions', () => {
    const intake = makeIntake({ isAdult: false, playMode: 'couple' });
    const deck = eligibleQuestions(QUESTIONS, intake);
    expect(deck.length).toBeGreaterThan(0);
    for (const q of deck) {
      expect(q.category).not.toBe('intimacy');
      expect(q.intensity).toBeLessThan(4);
      expect(q.audience.adultOnly).toBe(false);
    }
  });

  it('friends mode yields only self-directed questions', () => {
    const intake = makeIntake({ playMode: 'friends' });
    const deck = eligibleQuestions(QUESTIONS, intake);
    expect(deck.length).toBeGreaterThan(0);
    for (const q of deck) {
      expect(q.directedAt).toBe('self');
      expect(q.audience.playMode).not.toBe('couple');
    }
  });

  it('an adult couple gets a large eligible pool', () => {
    const intake = makeIntake({ isAdult: true, playMode: 'couple' });
    const deck = eligibleQuestions(QUESTIONS, intake);
    expect(deck.length).toBeGreaterThan(300);
  });
});

describe('buildDeck', () => {
  it('is deterministic for a fixed seed and reshuffles for a new one', () => {
    const intake = makeIntake();
    const a = buildDeck(QUESTIONS, intake, 12345);
    const b = buildDeck(QUESTIONS, intake, 12345);
    const c = buildDeck(QUESTIONS, intake, 99999);
    expect(a.ids).toEqual(b.ids);
    expect(a.ids).not.toEqual(c.ids);
    // Same multiset, different order.
    expect([...a.ids].sort()).toEqual([...c.ids].sort());
  });

  it('only includes eligible ids', () => {
    const intake = makeIntake({ isAdult: false });
    const { ids } = buildDeck(QUESTIONS, intake, 1);
    const idSet = new Set(ids);
    for (const q of QUESTIONS) {
      if (!isEligible(q, intake)) expect(idSet.has(q.id)).toBe(false);
    }
  });
});
