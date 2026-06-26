'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { QUESTION_MAP } from '@/lib/questions';
import { categoryMeta } from '@/lib/categories';
import { faceGradient, genderForIdx, turnFor } from '@/lib/deckView';
import type { Gender } from '@/lib/types';
import { CardFace } from './CardFace';

// Depth-based rest transforms. Cards use transform-origin center-bottom, so each
// deeper card's bottom edge peeks below the front by exactly its `y` → a clear stack.
const REST = [
  { y: 0, z: 0, scale: 1, rotateX: 0, rotateZ: 0, opacity: 1 },
  { y: 20, z: -44, scale: 0.965, rotateX: 1.5, rotateZ: -2, opacity: 0.94 },
  { y: 40, z: -88, scale: 0.93, rotateX: 3, rotateZ: 2, opacity: 0.86 },
  { y: 60, z: -132, scale: 0.895, rotateX: 4.5, rotateZ: -2.8, opacity: 0.74 },
];

// Advance = the top card tucks to the back of the stack: a small lift, then it
// drops back, scales down and fades while the cards beneath promote forward.
// `x: 0` re-centers a card that was mid-drag. Symmetric (no swipe direction).
const TUCK_EXIT = {
  x: 0,
  y: [0, -16, 46],
  z: [0, 30, -130],
  scale: [1, 1.04, 0.84],
  rotateX: [0, -2, 6],
  rotateZ: 0,
  opacity: [1, 1, 0],
  zIndex: 60,
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, times: [0, 0.32, 1] },
};

const BASE_SHADOW =
  '0 28px 46px -16px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.04)';
const DRAG_SHADOW =
  '0 50px 70px -24px rgba(0,0,0,.85), 0 0 34px -6px rgba(230,180,90,.4)';

const VISIBLE = 4;

export function CardStack({
  deck,
  cursor,
  names,
  genders,
  locked,
  reduced,
  onAdvance,
}: {
  deck: string[];
  cursor: number;
  names: [string, string];
  genders: [Gender, Gender];
  locked: boolean;
  reduced: boolean;
  onAdvance: () => void;
}) {
  const depthCount = reduced ? 1 : VISIBLE;

  const window = [];
  for (let d = 0; d < depthCount; d++) {
    const absIdx = cursor + d;
    const id = deck[absIdx];
    if (!id) break;
    const q = QUESTION_MAP.get(id);
    if (!q) break;
    window.push({ id, q, depth: d, absIdx });
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (locked) return;
    const passed = Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500;
    if (passed) onAdvance();
  }

  return (
    <div className="flex-1 flex items-center justify-center py-3.5">
      <div
        className="relative"
        style={{
          width: 'min(86vw, 330px)',
          aspectRatio: '0.7',
          perspective: 1200,
        }}
      >
        <AnimatePresence initial={false}>
          {window
            .slice()
            .reverse() /* render deepest first so the top card is last in DOM */
            .map(({ id, q, depth, absIdx }) => {
              const meta = categoryMeta(q.category);
              const isTop = depth === 0;
              const gender = genderForIdx(absIdx, genders);
              const turn = turnFor(absIdx, names);

              if (reduced) {
                return (
                  <motion.div
                    key={id}
                    className="absolute inset-0 rounded-3xl border border-line overflow-hidden"
                    style={{ background: faceGradient(meta.from, gender), boxShadow: BASE_SHADOW }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardFace
                      categoryName={meta.name}
                      categoryColor={meta.color}
                      text={q.text}
                      turnLabel={turn}
                      isTop
                    />
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={id}
                  className="absolute inset-0 rounded-3xl border border-line overflow-hidden will-change-transform"
                  style={{
                    background: faceGradient(meta.from, gender),
                    boxShadow: BASE_SHADOW,
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 100%',
                    zIndex: 50 - depth,
                    touchAction: 'none',
                    cursor: isTop && !locked ? 'grab' : 'default',
                  }}
                  initial={{ ...REST[Math.min(depth, REST.length - 1)], opacity: 0 }}
                  animate={REST[Math.min(depth, REST.length - 1)]}
                  exit={TUCK_EXIT}
                  transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                  drag={isTop && !locked ? 'x' : false}
                  dragSnapToOrigin
                  dragElastic={0.7}
                  whileDrag={{ cursor: 'grabbing', boxShadow: DRAG_SHADOW }}
                  onDragEnd={handleDragEnd}
                >
                  <CardFace
                    categoryName={meta.name}
                    categoryColor={meta.color}
                    text={q.text}
                    turnLabel={turn}
                    isTop={isTop}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
