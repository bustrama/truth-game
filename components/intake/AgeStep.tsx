'use client';

import { StepShell } from './StepShell';
import { OptionButton } from '@/components/ui/buttons';
import { BRAND } from '@/lib/brand';

export function AgeStep({ onPick }: { onPick: (isAdult: boolean) => void }) {
  return (
    <StepShell screen="age">
      <div className="flex flex-col gap-3.5 items-center text-center">
        <div className="text-xs tracking-[0.16em] text-muted font-semibold">
          {BRAND.nameHe}
        </div>
        <h1 className="font-sans font-bold text-[30px] leading-[1.3] m-0 text-ink">
          מה גיל המשתתפים?
        </h1>
        <p className="m-0 text-sm leading-[1.6] text-muted max-w-[300px]">
          זה מתאים את התוכן לגיל המשתתפים. לא מאמת זהות, לא נשמר בשום מקום.
        </p>
      </div>
      <div className="flex flex-col gap-3.5">
        <OptionButton
          className="py-5 !text-[18px] min-h-[64px]"
          onClick={() => onPick(true)}
        >
          18 ומעלה
        </OptionButton>
        <OptionButton
          className="py-5 !text-[18px] min-h-[64px]"
          onClick={() => onPick(false)}
        >
          מתחת ל-18
        </OptionButton>
      </div>
    </StepShell>
  );
}
