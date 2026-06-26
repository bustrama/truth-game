'use client';

import { useEffect, useReducer, useRef } from 'react';
import type {
  Gender,
  GameState,
  Intake,
  PlayMode,
  RelationshipStatus,
} from './types';
import { buildDeck } from './filter';
import { QUESTIONS } from './questions';
import { randomSeed } from './shuffle';
import {
  clearAll,
  hasResumableGame,
  loadGame,
  saveGame,
} from './storage';

export type Screen =
  | 'welcome'
  | 'age'
  | 'status'
  | 'kids'
  | 'mode'
  | 'names'
  | 'deck'
  | 'exhausted';

export const INTAKE_ORDER: Screen[] = ['age', 'status', 'kids', 'mode', 'names'];

export interface MachineState {
  screen: Screen;
  // intake under construction
  isAdult: boolean | null;
  relationshipStatus: RelationshipStatus | null;
  hasKids: boolean | null;
  playMode: PlayMode | null;
  playerA: string;
  playerB: string;
  genders: [Gender, Gender];
  // assembled intake (set on start/resume)
  intake: Intake | null;
  // game
  deck: string[];
  cursor: number;
  // ui
  showResume: boolean;
  resumeRemaining: number;
  hydrated: boolean;
}

const initialState: MachineState = {
  screen: 'welcome',
  isAdult: null,
  relationshipStatus: null,
  hasKids: null,
  playMode: null,
  playerA: '',
  playerB: '',
  genders: ['', ''],
  intake: null,
  deck: [],
  cursor: 0,
  showResume: false,
  resumeRemaining: 0,
  hydrated: false,
};

type Action =
  | { type: 'HYDRATE'; resumable: GameState | null }
  | { type: 'SET_AGE'; isAdult: boolean }
  | { type: 'SET_STATUS'; status: RelationshipStatus }
  | { type: 'SET_KIDS'; hasKids: boolean }
  | { type: 'SET_MODE'; mode: PlayMode }
  | { type: 'SET_GENDER'; index: 0 | 1; gender: Gender }
  | { type: 'BACK' }
  | { type: 'BEGIN' }
  | { type: 'START'; playerA: string; playerB: string }
  | { type: 'ADVANCE' }
  | { type: 'RESHUFFLE' }
  | { type: 'FULL_RESTART' }
  | { type: 'QUIT' }
  | { type: 'DO_RESUME' }
  | { type: 'DO_RESTART' };

function assembleIntake(s: MachineState): Intake {
  return {
    isAdult: !!s.isAdult,
    relationshipStatus: s.relationshipStatus ?? 'single',
    hasKids: !!s.hasKids,
    playMode: s.playMode ?? 'couple',
    playerA: s.playerA || undefined,
    playerB: s.playerB || undefined,
    genders: s.genders,
  };
}

function startDeck(s: MachineState, playerA: string, playerB: string): MachineState {
  const next: MachineState = { ...s, playerA, playerB };
  const intake = assembleIntake(next);
  const { ids } = buildDeck(QUESTIONS, intake, randomSeed());
  return { ...next, intake, deck: ids, cursor: 0, screen: 'deck' };
}

function reducer(state: MachineState, action: Action): MachineState {
  switch (action.type) {
    case 'HYDRATE': {
      const saved = action.resumable;
      if (saved && hasResumableGame(saved)) {
        return {
          ...state,
          hydrated: true,
          showResume: true,
          resumeRemaining: saved.deck.length - saved.cursor,
        };
      }
      return { ...state, hydrated: true };
    }
    case 'BEGIN':
      return { ...state, screen: 'age' };
    case 'SET_AGE':
      return { ...state, isAdult: action.isAdult, screen: 'status' };
    case 'SET_STATUS':
      return { ...state, relationshipStatus: action.status, screen: 'kids' };
    case 'SET_KIDS':
      return { ...state, hasKids: action.hasKids, screen: 'mode' };
    case 'SET_MODE':
      return { ...state, playMode: action.mode, screen: 'names' };
    case 'SET_GENDER': {
      const genders: [Gender, Gender] = [...state.genders];
      // toggle off if same value tapped again
      genders[action.index] =
        genders[action.index] === action.gender ? '' : action.gender;
      return { ...state, genders };
    }
    case 'BACK': {
      const i = INTAKE_ORDER.indexOf(state.screen);
      if (i > 0) return { ...state, screen: INTAKE_ORDER[i - 1] };
      return state;
    }
    case 'START':
      return startDeck(state, action.playerA.trim(), action.playerB.trim());
    case 'ADVANCE': {
      const next = state.cursor + 1;
      if (next >= state.deck.length) return { ...state, screen: 'exhausted' };
      return { ...state, cursor: next };
    }
    case 'RESHUFFLE': {
      if (!state.intake) return state;
      const { ids } = buildDeck(QUESTIONS, state.intake, randomSeed());
      return { ...state, deck: ids, cursor: 0, screen: 'deck' };
    }
    case 'QUIT':
      return { ...initialState, hydrated: true };
    case 'FULL_RESTART':
      return { ...initialState, hydrated: true };
    case 'DO_RESTART':
      // Returning player explicitly chose a fresh game — skip the landing.
      return { ...initialState, hydrated: true, screen: 'age' };
    case 'DO_RESUME': {
      const saved = loadGame();
      if (!saved) return { ...state, showResume: false };
      return {
        ...state,
        showResume: false,
        intake: saved.intake,
        deck: saved.deck,
        cursor: saved.cursor,
        isAdult: saved.intake.isAdult,
        relationshipStatus: saved.intake.relationshipStatus,
        hasKids: saved.intake.hasKids,
        playMode: saved.intake.playMode,
        playerA: saved.intake.playerA ?? '',
        playerB: saved.intake.playerB ?? '',
        genders: saved.intake.genders ?? ['', ''],
        screen: 'deck',
      };
    }
    default:
      return state;
  }
}

export interface GameApi {
  state: MachineState;
  setAge: (isAdult: boolean) => void;
  setStatus: (status: RelationshipStatus) => void;
  setKids: (hasKids: boolean) => void;
  setMode: (mode: PlayMode) => void;
  setGender: (index: 0 | 1, gender: Gender) => void;
  begin: () => void;
  back: () => void;
  start: (playerA: string, playerB: string) => void;
  advance: () => void;
  reshuffle: () => void;
  fullRestart: () => void;
  quit: () => void;
  doResume: () => void;
  doRestart: () => void;
}

export function useGame(): GameApi {
  const [state, dispatch] = useReducer(reducer, initialState);
  const didHydrate = useRef(false);

  // Hydrate from storage once on mount.
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    dispatch({ type: 'HYDRATE', resumable: loadGame() });
  }, []);

  // Persist whenever an active game advances.
  useEffect(() => {
    if (!state.intake) return;
    if (state.screen !== 'deck' && state.screen !== 'exhausted') return;
    saveGame({
      intake: state.intake,
      deck: state.deck,
      cursor: state.cursor,
      turn: state.cursor % 2 === 0 ? 'A' : 'B',
      seen: state.deck.slice(0, state.cursor),
    });
  }, [state.intake, state.deck, state.cursor, state.screen]);

  return {
    state,
    setAge: (isAdult) => dispatch({ type: 'SET_AGE', isAdult }),
    setStatus: (status) => dispatch({ type: 'SET_STATUS', status }),
    setKids: (hasKids) => dispatch({ type: 'SET_KIDS', hasKids }),
    setMode: (mode) => dispatch({ type: 'SET_MODE', mode }),
    setGender: (index, gender) => dispatch({ type: 'SET_GENDER', index, gender }),
    begin: () => dispatch({ type: 'BEGIN' }),
    back: () => dispatch({ type: 'BACK' }),
    start: (playerA, playerB) => dispatch({ type: 'START', playerA, playerB }),
    advance: () => dispatch({ type: 'ADVANCE' }),
    reshuffle: () => dispatch({ type: 'RESHUFFLE' }),
    fullRestart: () => {
      clearAll();
      dispatch({ type: 'FULL_RESTART' });
    },
    quit: () => dispatch({ type: 'QUIT' }),
    doResume: () => dispatch({ type: 'DO_RESUME' }),
    doRestart: () => {
      clearAll();
      dispatch({ type: 'DO_RESTART' });
    },
  };
}
