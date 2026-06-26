'use client';

import { motion } from 'framer-motion';

export interface SheetAction {
  label: string;
  onClick: () => void;
  tone?: 'primary' | 'default' | 'danger';
}

function actionClass(tone: SheetAction['tone']) {
  const base =
    'appearance-none rounded-2xl py-[15px] px-4 text-[16px] font-semibold min-h-[52px] cursor-pointer transition-colors';
  if (tone === 'primary')
    return `${base} border-0 bg-gold text-bg hover:bg-gold-hi`;
  if (tone === 'danger')
    return `${base} border bg-transparent`;
  return `${base} border border-line bg-transparent text-ink hover:border-gold`;
}

/** Slide-up bottom sheet with a vertical stack of actions and an optional note. */
export function MenuSheet({
  onClose,
  title,
  note,
  actions,
}: {
  onClose: () => void;
  title?: string;
  note?: string;
  actions: SheetAction[];
}) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(8,6,16,.72)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full bg-surface border-t border-line max-w-[520px] mx-auto flex flex-col gap-4"
        style={{
          borderRadius: '24px 24px 0 0',
          padding: '20px 22px calc(24px + env(safe-area-inset-bottom))',
        }}
        initial={{ y: 48 }}
        animate={{ y: 0 }}
        exit={{ y: 48 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[42px] h-1 bg-line rounded self-center" />
        {title && (
          <h2 className="font-serif font-bold text-[20px] m-0 text-center">
            {title}
          </h2>
        )}
        <div className="flex flex-col gap-2.5">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={actionClass(a.tone)}
              style={
                a.tone === 'danger'
                  ? { borderColor: 'rgba(224,86,110,0.5)', color: '#E0566E' }
                  : undefined
              }
            >
              {a.label}
            </button>
          ))}
        </div>
        {note && (
          <p className="m-0 text-center text-[12px] leading-[1.6] text-muted-2">
            {note}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
