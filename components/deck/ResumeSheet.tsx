'use client';

import { motion } from 'framer-motion';
import { PrimaryButton } from '@/components/ui/buttons';

export function ResumeSheet({
  remaining,
  onResume,
  onRestart,
}: {
  remaining: number;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(8,6,16,.72)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="w-full bg-surface border-t border-line max-w-[520px] mx-auto flex flex-col gap-[18px]"
        style={{
          borderRadius: '24px 24px 0 0',
          padding: '28px 22px calc(28px + env(safe-area-inset-bottom))',
        }}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-[42px] h-1 bg-line rounded self-center" />
        <div className="text-center flex flex-col gap-1.5">
          <h2 className="font-serif font-bold text-[22px] m-0">יש משחק פתוח</h2>
          <p className="m-0 text-sm text-muted">נשארו עוד {remaining} קלפים</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <PrimaryButton onClick={onResume}>להמשיך מאיפה שעצרתם</PrimaryButton>
          <button
            onClick={onRestart}
            className="appearance-none border border-line bg-transparent text-ink rounded-2xl py-[15px] text-[15px] font-semibold min-h-[52px] cursor-pointer transition-colors hover:border-gold"
          >
            להתחיל מחדש
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
