'use client';

import { useRef, useState } from 'react';
import { TopBar } from './TopBar';
import { CardStack, type FlingDir } from './CardStack';
import { PrimaryButton } from '@/components/ui/buttons';
import { turnFor } from '@/lib/deckView';
import type { Gender } from '@/lib/types';

const ANIM_MS = 480;

export function DeckScreen({
  deck,
  cursor,
  names,
  genders,
  reduced,
  onAdvance,
  onQuit,
}: {
  deck: string[];
  cursor: number;
  names: [string, string];
  genders: [Gender, Gender];
  reduced: boolean;
  onAdvance: () => void;
  onQuit: () => void;
}) {
  const [dir, setDir] = useState<FlingDir>('left');
  const [locked, setLocked] = useState(false);
  const lockRef = useRef(false);

  function advance(d: FlingDir) {
    if (lockRef.current) return;
    lockRef.current = true;
    setLocked(true);
    setDir(d);
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
      <TopBar cur={cur} total={total} turnLabel={topTurn} onQuit={onQuit} />

      <CardStack
        deck={deck}
        cursor={cursor}
        names={names}
        genders={genders}
        dir={dir}
        locked={locked}
        reduced={reduced}
        onAdvance={advance}
      />

      <div className="flex flex-col gap-2.5 items-center">
        <PrimaryButton
          className="w-full"
          onClick={() => advance('left')}
          disabled={locked}
        >
          הבא
        </PrimaryButton>
        <div className="text-xs text-muted-2">
          {reduced ? 'הקישו להמשך' : 'החליקו את הקלף או הקישו'}
        </div>
      </div>
    </div>
  );
}
