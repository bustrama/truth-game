'use client';

import { PrimaryButton } from '@/components/ui/buttons';

const STEPS = [
  'עונים על כמה שאלות קצרות, כדי להתאים את המשחק אליכם.',
  'מעבירים את הטלפון בין שניכם.',
  'שולפים קלף, עונים באמת, וממשיכים הלאה.',
];

export function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-[22px] py-9 max-w-[520px] w-full mx-auto">
      <div className="my-auto flex flex-col gap-9 animate-fade">
        {/* Hero */}
        <div className="flex flex-col gap-3 items-center text-center">
          <h1 className="font-serif font-bold text-[44px] leading-[1.05] m-0 text-ink">
            אמת או אמת
          </h1>
          <p className="m-0 text-[16px] text-muted-3">
            שאלה אחת בכל פעם — וההיכרות מעמיקה.
          </p>
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

        {/* CTA + privacy */}
        <div className="flex flex-col gap-3 pt-1">
          <PrimaryButton onClick={onBegin}>בואו נתחיל</PrimaryButton>
          <p className="m-0 text-center text-[12px] leading-[1.6] text-muted-2">
            בלי הרשמה. שום תשובה לא נשמרת. רק אתם והשאלות.
          </p>
        </div>
      </div>
    </div>
  );
}
