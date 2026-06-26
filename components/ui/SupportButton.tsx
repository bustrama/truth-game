'use client';

import { BRAND } from '@/lib/brand';

/** Prominent "buy me a coffee" link to Ko-fi (opens in a new tab). */
export function SupportButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={BRAND.kofi}
      target="_blank"
      rel="noopener noreferrer"
      className={
        'flex items-center justify-center gap-2 rounded-2xl px-5 py-[15px] ' +
        'min-h-[54px] text-[16px] font-bold text-gold-hi no-underline ' +
        'border border-gold/50 transition-colors hover:border-gold ' +
        'hover:bg-[rgba(230,180,90,0.12)] ' +
        className
      }
      style={{ background: 'rgba(230,180,90,0.08)' }}
    >
      <span aria-hidden className="text-[18px]">
        ☕
      </span>
      <span>קנו לי קפה</span>
    </a>
  );
}
