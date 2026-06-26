import type { Gender } from './types';

// Pure presentation helpers shared by the deck UI (kept out of components for
// clarity/testability). All derive from the absolute card index in the deck.

/** Turn label for the card at absolute deck index `idx`, given player names. */
export function turnFor(idx: number, names: [string, string]): string | null {
  const [a, b] = names;
  if (!a && !b) return null;
  const name = idx % 2 === 0 ? a || b : b || a;
  return name ? `התור של ${name}` : null;
}

/** Which player's gender themes the card at `idx` (falls back to the other). */
export function genderForIdx(
  idx: number,
  genders: [Gender, Gender],
): Gender {
  const [g0, g1] = genders;
  if (!g0 && !g1) return '';
  const primary = idx % 2 === 0 ? 0 : 1;
  return genders[primary] || genders[1 - primary] || '';
}

const GENDER_GRADIENT: Record<'male' | 'female', string> = {
  female:
    'linear-gradient(168deg, #9A47B0 0%, #C8478C 30%, #2a2140 60%, #1E1830 100%)',
  male: 'linear-gradient(168deg, #2FA06F 0%, #2C73B4 30%, #233048 60%, #1E1830 100%)',
};

/** Card face background — gender accent when set, else category gradient. */
export function faceGradient(categoryFrom: string, gender: Gender): string {
  if (gender) return GENDER_GRADIENT[gender];
  return `linear-gradient(168deg, ${categoryFrom} 0%, #221b36 52%, #1E1830 100%)`;
}
