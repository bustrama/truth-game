'use client';

import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGame } from '@/lib/useGame';
import { WelcomeScreen } from './WelcomeScreen';
import { AgeStep } from './intake/AgeStep';
import { StatusStep } from './intake/StatusStep';
import { KidsStep } from './intake/KidsStep';
import { ModeStep } from './intake/ModeStep';
import { NamesStep } from './intake/NamesStep';
import { DeckScreen } from './deck/DeckScreen';
import { ExhaustedScreen } from './deck/ExhaustedScreen';
import { ResumeSheet } from './deck/ResumeSheet';

export function Game() {
  const reduced = !!useReducedMotion();
  const g = useGame();
  const s = g.state;
  const names: [string, string] = [s.playerA, s.playerB];

  return (
    <main className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col">
      {s.screen === 'welcome' && <WelcomeScreen onBegin={g.begin} />}
      {s.screen === 'age' && <AgeStep onPick={g.setAge} />}
      {s.screen === 'status' && <StatusStep onPick={g.setStatus} onBack={g.back} />}
      {s.screen === 'kids' && <KidsStep onPick={g.setKids} onBack={g.back} />}
      {s.screen === 'mode' && <ModeStep onPick={g.setMode} onBack={g.back} />}
      {s.screen === 'names' && (
        <NamesStep
          genders={s.genders}
          onSetGender={g.setGender}
          onStart={g.start}
        />
      )}
      {s.screen === 'deck' && (
        <DeckScreen
          deck={s.deck}
          cursor={s.cursor}
          names={names}
          genders={s.genders}
          reduced={reduced}
          onAdvance={g.advance}
          onQuit={g.quit}
        />
      )}
      {s.screen === 'exhausted' && (
        <ExhaustedScreen onReshuffle={g.reshuffle} onRestart={g.fullRestart} />
      )}

      <AnimatePresence>
        {s.showResume && (
          <ResumeSheet
            remaining={s.resumeRemaining}
            onResume={g.doResume}
            onRestart={g.doRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
