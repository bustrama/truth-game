import type { GameState, Intake } from './types';
import { BRAND } from './brand';

// Single source of persistence. No PII leaves the device (spec §8/§9).
const GAME_KEY = `${BRAND.slug}:game`;
const INTAKE_KEY = `${BRAND.slug}:intake`;

function canStore(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function loadGame(): GameState | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (
      parsed &&
      Array.isArray(parsed.deck) &&
      typeof parsed.cursor === 'number' &&
      parsed.intake
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(GAME_KEY, JSON.stringify(state));
    window.localStorage.setItem(INTAKE_KEY, JSON.stringify(state.intake));
  } catch {
    /* quota / privacy mode — ignore, app stays usable in-memory */
  }
}

export function loadIntake(): Intake | null {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(INTAKE_KEY);
    return raw ? (JSON.parse(raw) as Intake) : null;
  } catch {
    return null;
  }
}

export function clearAll(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(GAME_KEY);
    window.localStorage.removeItem(INTAKE_KEY);
  } catch {
    /* ignore */
  }
}

/** Is there a resumable in-progress game (started, not finished)? */
export function hasResumableGame(g: GameState | null): g is GameState {
  return (
    !!g &&
    Array.isArray(g.deck) &&
    g.deck.length > 0 &&
    g.cursor > 0 &&
    g.cursor < g.deck.length
  );
}
