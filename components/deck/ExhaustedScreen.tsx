'use client';

import { PrimaryButton, OptionButton } from '@/components/ui/buttons';
import { SupportButton } from '@/components/ui/SupportButton';

export function ExhaustedScreen({
  onResetReplay,
  onRestart,
}: {
  onResetReplay: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[30px] px-[26px] py-8 max-w-[520px] w-full mx-auto text-center animate-fade">
      {/* stacked deck glyph */}
      <div className="relative" style={{ width: 'min(70vw,220px)', aspectRatio: '0.7' }}>
        <div
          className="absolute inset-0 rounded-[22px] border border-line opacity-50"
          style={{ background: '#171327', transform: 'translateY(14px) scale(0.92)' }}
        />
        <div
          className="absolute inset-0 rounded-[22px] border border-line opacity-75"
          style={{ background: '#1b1530', transform: 'translateY(7px) scale(0.96)' }}
        />
        <div
          className="absolute inset-0 rounded-[22px] border border-line flex items-center justify-center"
          style={{ background: 'linear-gradient(165deg,#241d3a,#1E1830)' }}
        >
          <div className="font-sans font-extrabold text-[40px] text-gold">סוף</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-bold text-[25px] leading-[1.35] m-0">
          ראיתם את כל השאלות
        </h1>
        <p className="m-0 text-[15px] text-muted leading-[1.6]">
          עברתם על כל השאלות שמתאימות לכם. אפשר לאפס ולהתחיל סבב חדש מההתחלה.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 w-full max-w-[300px]">
        <PrimaryButton onClick={onResetReplay}>לאפס ולשחק שוב</PrimaryButton>
        <OptionButton className="!py-4 min-h-[54px] !text-base" onClick={onRestart}>
          להתחיל מחדש עם הגדרות אחרות
        </OptionButton>
        <SupportButton className="mt-1" />
      </div>
    </div>
  );
}
