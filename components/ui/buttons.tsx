'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/** Solid gold CTA — "להתחיל", "הבא", "לערבב מחדש". */
export function PrimaryButton({ children, className = '', ...rest }: BaseProps) {
  return (
    <button
      {...rest}
      className={
        'appearance-none border-0 bg-gold text-bg rounded-2xl px-5 py-[18px] ' +
        'text-[17px] font-bold min-h-[58px] cursor-pointer shadow-gold ' +
        'transition-colors hover:bg-gold-hi active:translate-y-px ' +
        className
      }
    >
      {children}
    </button>
  );
}

/** Outlined surface option — intake choices, secondary actions. */
export function OptionButton({ children, className = '', ...rest }: BaseProps) {
  return (
    <button
      {...rest}
      className={
        'appearance-none border border-line bg-surface text-ink rounded-2xl ' +
        'px-4 py-5 text-[17px] font-semibold min-h-[60px] cursor-pointer ' +
        'transition-colors hover:border-gold ' +
        className
      }
    >
      {children}
    </button>
  );
}

/** Text-only tertiary — "חזרה", "דלגו". */
export function GhostButton({ children, className = '', ...rest }: BaseProps) {
  return (
    <button
      {...rest}
      className={
        'appearance-none border-0 bg-transparent text-muted text-sm ' +
        'cursor-pointer px-2.5 py-2.5 rounded-lg transition-colors hover:text-ink ' +
        className
      }
    >
      {children}
    </button>
  );
}
