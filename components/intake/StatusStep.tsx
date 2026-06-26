'use client';

import { StepShell } from './StepShell';
import { OptionButton } from '@/components/ui/buttons';
import type { RelationshipStatus } from '@/lib/types';

const OPTS: { label: string; value: RelationshipStatus }[] = [
  { label: 'רווק/ה', value: 'single' },
  { label: 'בזוגיות', value: 'dating' },
  { label: 'נשוי/אה', value: 'married' },
  { label: 'גרוש/ה', value: 'divorced' },
];

export function StatusStep({
  onPick,
  onBack,
}: {
  onPick: (status: RelationshipStatus) => void;
  onBack: () => void;
}) {
  return (
    <StepShell screen="status" onBack={onBack}>
      <h1 className="font-sans font-bold text-[27px] leading-[1.3] m-0 text-center">
        מה הסטטוס שלכם?
      </h1>
      <div className="grid grid-cols-2 gap-3">
        {OPTS.map((o) => (
          <OptionButton
            key={o.value}
            className="!text-base px-3.5 py-[22px] min-h-[64px]"
            onClick={() => onPick(o.value)}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    </StepShell>
  );
}
