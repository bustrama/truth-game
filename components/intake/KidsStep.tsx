'use client';

import { StepShell } from './StepShell';
import { OptionButton } from '@/components/ui/buttons';

export function KidsStep({
  onPick,
  onBack,
}: {
  onPick: (hasKids: boolean) => void;
  onBack: () => void;
}) {
  return (
    <StepShell screen="kids" onBack={onBack}>
      <h1 className="font-sans font-bold text-[27px] leading-[1.3] m-0 text-center">
        יש ילדים?
      </h1>
      <div className="flex flex-col gap-3.5">
        <OptionButton onClick={() => onPick(true)}>יש ילדים</OptionButton>
        <OptionButton onClick={() => onPick(false)}>אין ילדים</OptionButton>
      </div>
    </StepShell>
  );
}
