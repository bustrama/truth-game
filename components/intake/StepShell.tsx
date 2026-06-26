'use client';

import type { ReactNode } from 'react';
import { StepDots } from './StepDots';
import { GhostButton } from '@/components/ui/buttons';
import type { Screen } from '@/lib/useGame';

/** Common intake step frame: dots on top, centered content, optional back/footer. */
export function StepShell({
  screen,
  children,
  onBack,
  footer,
}: {
  screen: Screen;
  children: ReactNode;
  onBack?: () => void;
  footer?: ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col px-[22px] pt-7 pb-9 max-w-[520px] w-full mx-auto">
      <StepDots screen={screen} />
      <div className="flex-1 flex flex-col justify-center gap-7 animate-fade-fast">
        {children}
      </div>
      {footer}
      {onBack && (
        <GhostButton className="self-center" onClick={onBack}>
          חזרה
        </GhostButton>
      )}
    </div>
  );
}
