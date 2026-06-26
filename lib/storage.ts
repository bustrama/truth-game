import type { GameState, Intake } from './types';
import { BRAND } from './brand';

// Single source of persistence. No PII leaves the device (spec §8/§9).
const GAME_KEY = `${BRAND.slug}:game`;
const INTAKE_KEY = `${BRAND.slug}:intake`;
// Persistent history of every question id already asked (across rounds), so new
// rounds don't repeat them until the player resets.
const SEEN_KEY = `${BRAND.slug}:seen`;

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

// ---------- asked-question history ----------

export function loadSeen(): string[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === 'string') as string[]) : [];
  } catch {
    return [];
  }
}

/** Merge ids into the persistent asked-history (union, deduped). */
export function addSeen(ids: string[]): void {
  if (!canStore() || ids.length === 0) return;
  try {
    const set = new Set(loadSeen());
    for (const id of ids) set.add(id);
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function clearSeen(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(SEEN_KEY);
  } catch {
    /* ignore */
  }
}

/** True if there's anything worth resetting (a game, intake, or asked-history). */
export function hasSavedData(): boolean {
  if (!canStore()) return false;
  try {
    return (
      !!window.localStorage.getItem(GAME_KEY) ||
      !!window.localStorage.getItem(INTAKE_KEY) ||
      loadSeen().length > 0
    );
  } catch {
    return false;
  }
}

/** Full reset — clears the current game, intake, and asked-question history. */
export function resetAll(): void {
  clearAll();
  clearSeen();
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
