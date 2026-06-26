import type { Intake, Question } from './types';
import { shuffle, randomSeed } from './shuffle';

/**
 * Eligibility predicate — copied from TECHNICAL_SPEC.md §4.
 * Pure function of (Question, Intake). Run once after intake to build the deck.
 */
export function isEligible(q: Question, i: Intake): boolean {
  // Age gate
  if (q.audience.adultOnly && !i.isAdult) return false;

  // Non-adults: hard cap on exposure regardless of category (minor-safety floor)
  if (!i.isAdult && (q.intensity >= 4 || q.category === 'intimacy')) return false;

  // Relationship status
  if (
    q.audience.statuses !== 'any' &&
    !q.audience.statuses.includes(i.relationshipStatus)
  )
    return false;

  // Kids
  if (q.audience.kids === 'hasKids' && !i.hasKids) return false;
  if (q.audience.kids === 'noKids' && i.hasKids) return false;

  // Play mode
  if (q.audience.playMode !== 'any' && q.audience.playMode !== i.playMode)
    return false;

  // Partner-directed questions require couple mode
  if (q.directedAt !== 'self' && i.playMode !== 'couple') return false;

  // Optional intake control: drop sensitive questions
  if (i.skipSensitive && q.sensitive) return false;

  return true;
}

export function eligibleQuestions(
  questions: readonly Question[],
  intake: Intake,
): Question[] {
  return questions.filter((q) => isEligible(q, intake));
}

export interface BuiltDeck {
  ids: string[];
  seed: number;
}

/**
 * Deck construction: filter → seeded shuffle → ids.
 * Returns the seed so the same deck can be reproduced on resume.
 */
export function buildDeck(
  questions: readonly Question[],
  intake: Intake,
  seed: number = randomSeed(),
): BuiltDeck {
  const eligible = eligibleQuestions(questions, intake);
  const ids = shuffle(eligible, seed).map((q) => q.id);
  return { ids, seed };
}
