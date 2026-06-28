'use client';

import { StepShell } from './StepShell';
import type { PlayMode } from '@/lib/types';

const OPTS: { label: string; sub: string; value: PlayMode }[] = [
  { label: 'בני זוג', sub: 'כולל שאלות זוגיות ואינטימיות', value: 'couple' },
  { label: 'חברים', sub: 'בלי שאלות זוגיות', value: 'friends' },
];

export function ModeStep({
  onPick,
  onBack,
}: {
  onPick: (mode: PlayMode) => void;
  onBack: () => void;
}) {
  return (
    <StepShell screen="mode" onBack={onBack}>
      <h1 className="font-sans font-bold text-[27px] leading-[1.3] m-0 text-center">
        מה אופי המשחק?
      </h1>
      <div className="flex flex-col gap-3.5">
        {OPTS.map((o) => (
          <button
            key={o.value}
            onClick={() => onPick(o.value)}
            className="appearance-none border border-line bg-surface text-ink rounded-2xl p-5 min-h-[60px] cursor-pointer transition-colors hover:border-gold flex flex-col gap-1 items-center"
          >
            <span className="text-[17px] font-semibold">{o.label}</span>
            <span className="text-[13px] font-normal text-muted">{o.sub}</span>
          </button>
        ))}
      </div>
    </StepShell>
  );
}
