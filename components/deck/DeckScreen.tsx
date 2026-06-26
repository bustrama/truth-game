'use client';

import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { CardStack } from './CardStack';
import { PrimaryButton } from '@/components/ui/buttons';
import { MenuSheet } from '@/components/ui/MenuSheet';
import { turnFor } from '@/lib/deckView';
import type { Gender } from '@/lib/types';

const ANIM_MS = 520;

export function DeckScreen({
  deck,
  cursor,
  names,
  genders,
  reduced,
  onAdvance,
  onQuit,
  onReset,
}: {
  deck: string[];
  cursor: number;
  names: [string, string];
  genders: [Gender, Gender];
  reduced: boolean;
  onAdvance: () => void;
  onQuit: () => void;
  onReset: () => void;
}) {
  const [locked, setLocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lockRef = useRef(false);

  function advance() {
    if (lockRef.current) return;
    lockRef.current = true;
    setLocked(true);
    onAdvance();
    if (reduced) {
      // crossfade is quick; release sooner
      window.setTimeout(() => {
        lockRef.current = false;
        setLocked(false);
      }, 260);
    } else {
      window.setTimeout(() => {
        lockRef.current = false;
        setLocked(false);
      }, ANIM_MS);
    }
  }

  const total = deck.length;
  const cur = Math.min(cursor + 1, total);
  const topTurn = turnFor(cursor, names);

  return (
    <div className="flex-1 flex flex-col px-[18px] pt-[18px] pb-[30px] max-w-[520px] w-full mx-auto">
      <TopBar
        cur={cur}
        total={total}
        turnLabel={topTurn}
        onQuit={() => setMenuOpen(true)}
      />

      <CardStack
        deck={deck}
        cursor={cursor}
        names={names}
        genders={genders}
        locked={locked}
        reduced={reduced}
        onAdvance={advance}
      />

      <div className="flex flex-col gap-2.5 items-center">
        <PrimaryButton
          className="w-full"
          onClick={() => advance()}
          disabled={locked}
        >
          הבא
        </PrimaryButton>
        <div className="text-xs text-muted-2">
          {reduced ? 'הקישו להמשך' : 'החליקו את הקלף או הקישו'}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <MenuSheet
            onClose={() => setMenuOpen(false)}
            note="ההתקדמות נשמרת במכשיר שלכם בלבד."
            actions={[
              {
                label: 'להמשיך לשחק',
                tone: 'default',
                onClick: () => setMenuOpen(false),
              },
              {
                label: 'לצאת למסך הבית',
                tone: 'default',
                onClick: () => {
                  setMenuOpen(false);
                  onQuit();
                },
              },
              {
                label: 'לאפס את ההתקדמות',
                tone: 'danger',
                onClick: () => {
                  setMenuOpen(false);
                  onReset();
                },
              },
            ]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
