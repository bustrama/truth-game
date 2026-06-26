'use client';

import { INTAKE_ORDER, type Screen } from '@/lib/useGame';

export function StepDots({ screen }: { screen: Screen }) {
  const stepIdx = INTAKE_ORDER.indexOf(screen);
  return (
    <div className="flex gap-[7px] justify-center mt-1.5">
      {INTAKE_ORDER.map((_, i) => (
        <div
          key={i}
          className="h-[7px] rounded transition-all duration-300"
          style={{
            width: i === stepIdx ? '22px' : '7px',
            background:
              i === stepIdx ? '#E6B45A' : i < stepIdx ? '#5a4f72' : '#2C2440',
          }}
        />
      ))}
    </div>
  );
}
