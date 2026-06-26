import rawQuestions from '@/data/questions.json';
import type { Question } from './types';

// The corpus ships in the bundle. It is validated at build time by
// scripts/validate-questions.ts (and in CI), so at runtime we trust the shape
// and avoid paying zod's parse cost on ~1,000 records on every load.
export const QUESTIONS = rawQuestions as Question[];

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/** Indexed lookup for hot paths (deck rendering resolves ids → questions). */
export const QUESTION_MAP: ReadonlyMap<string, Question> = new Map(
  QUESTIONS.map((q) => [q.id, q]),
);
