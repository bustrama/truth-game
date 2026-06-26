'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PrimaryButton, GhostButton } from '@/components/ui/buttons';
import { MenuSheet } from '@/components/ui/MenuSheet';
import { SupportButton } from '@/components/ui/SupportButton';
import { BRAND } from '@/lib/brand';

const STEPS = [
  'עונים על כמה שאלות קצרות, כדי להתאים את המשחק אליכם.',
  'מעבירים את הטלפון בין שניכם.',
  'שולפים קלף, עונים באמת, וממשיכים הלאה.',
];

export function WelcomeScreen({
  onBegin,
  hasSaved,
  onReset,
}: {
  onBegin: () => void;
  hasSaved: boolean;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-[22px] py-9 max-w-[520px] w-full mx-auto">
      <div className="my-auto flex flex-col gap-8 animate-fade">
        {/* Brand icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon-512.png"
          alt={BRAND.nameHe}
          width={108}
          height={108}
          className="mx-auto rounded-[26px]"
          style={{ boxShadow: '0 20px 44px -18px rgba(0,0,0,.75)' }}
        />

        {/* Hero */}
        <div className="flex flex-col gap-3 items-center text-center">
          <h1 className="font-sans font-extrabold text-[44px] leading-[1.05] m-0 text-ink">
            {BRAND.nameHe}
          </h1>
          <p className="m-0 text-[16px] text-muted-3">{BRAND.tagline}</p>
        </div>

        {/* Purpose */}
        <p className="m-0 text-center text-[15px] leading-[1.75] text-muted max-w-[370px] mx-auto">
          כל קלף הוא שאלה, וכל שאלה היא הזדמנות לגלות משהו חדש זה על זה. בלי משימות
          ובלי עונשים — רק אמת. לבני זוג, לחברים, או לכל שניים שרוצים להכיר לעומק.
        </p>

        {/* How it works */}
        <ol className="m-0 p-0 list-none flex flex-col gap-3.5">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex-none w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold text-gold border border-gold/40"
                style={{ background: 'rgba(230,180,90,0.10)' }}
              >
                {i + 1}
              </span>
              <span className="text-[15px] leading-[1.5] text-ink/90">{step}</span>
            </li>
          ))}
        </ol>

        {/* CTA + support + privacy */}
        <div className="flex flex-col gap-3 pt-1">
          <PrimaryButton onClick={onBegin}>בואו נתחיל</PrimaryButton>
          <SupportButton />
          <p className="m-0 text-center text-[12px] leading-[1.6] text-muted-2">
            בלי הרשמה. התשובות נשארות ביניכם — רק ההתקדמות נשמרת במכשיר שלכם.
          </p>
          {hasSaved && (
            <GhostButton
              className="self-center !text-[12px]"
              onClick={() => setConfirmReset(true)}
            >
              איפוס נתונים
            </GhostButton>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmReset && (
          <MenuSheet
            onClose={() => setConfirmReset(false)}
            title="לאפס את הנתונים?"
            note="ימחקו ההתקדמות והשאלות שכבר עלו. הכול נשמר רק במכשיר שלכם."
            actions={[
              {
                label: 'לאפס הכול',
                tone: 'danger',
                onClick: () => {
                  setConfirmReset(false);
                  onReset();
                },
              },
              {
                label: 'ביטול',
                tone: 'default',
                onClick: () => setConfirmReset(false),
              },
            ]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
