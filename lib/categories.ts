import type { Category } from './types';

export interface CategoryMeta {
  /** Hebrew display name shown on the card chip. */
  name: string;
  /** Dot / glow / edge accent color. */
  color: string;
  /** Gradient start used for the card face when no gender accent is active. */
  from: string;
}

/**
 * Maps the corpus's 9 categories to display name + colors.
 * The first 7 colors are taken verbatim from the Claude Design prototype's
 * CATS map; `deep` and `fun` are harmonized additions (the prototype's palette
 * only covered 7 of the 9 corpus categories).
 */
export const CATEGORIES: Record<Category, CategoryMeta> = {
  icebreaker: { name: 'שובר קרח', color: '#3FA8BE', from: '#2A6B7C' },
  'getting-to-know': { name: 'להכיר', color: '#6E91D6', from: '#3A5A8C' },
  past: { name: 'עבר', color: '#9C86D6', from: '#5B4A8C' },
  relationship: { name: 'זוגיות', color: '#D67FA3', from: '#8C4A6B' },
  values: { name: 'ערכים', color: '#7E92D6', from: '#4A5C8C' },
  future: { name: 'עתיד', color: '#54C2A4', from: '#3C7C6B' },
  deep: { name: 'עומק', color: '#B07FD6', from: '#5A3C8C' },
  fun: { name: 'קליל', color: '#E6A15A', from: '#8C6332' },
  intimacy: { name: 'אינטימיות', color: '#E0566E', from: '#9C3A52' },
};

export function categoryMeta(category: Category): CategoryMeta {
  return CATEGORIES[category];
}
