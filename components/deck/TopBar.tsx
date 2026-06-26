'use client';

import { GhostButton } from '@/components/ui/buttons';

export function TopBar({
  cur,
  total,
  turnLabel,
  onQuit,
}: {
  cur: number;
  total: number;
  turnLabel: string | null;
  onQuit: () => void;
}) {
  const pct = total > 0 ? (cur / total) * 100 : 0;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div
          dir="ltr"
          className="text-[13px] text-muted tabular-nums whitespace-nowrap"
        >
          {cur} / {total}
        </div>
        {turnLabel && (
          <div className="text-[13px] text-gold font-semibold">{turnLabel}</div>
        )}
        <GhostButton className="!text-[13px] !px-1.5 !py-1.5" onClick={onQuit}>
          יציאה
        </GhostButton>
      </div>
      <div className="h-[3px] bg-line rounded-[3px] overflow-hidden">
        <div
          className="h-full rounded-[3px] transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#E6B45A,#F2D49A)',
          }}
        />
      </div>
    </div>
  );
}
