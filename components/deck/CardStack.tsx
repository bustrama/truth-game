'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { QUESTION_MAP } from '@/lib/questions';
import { categoryMeta } from '@/lib/categories';
import { faceGradient, genderForIdx, turnFor } from '@/lib/deckView';
import type { Gender } from '@/lib/types';
import { CardFace } from './CardFace';

export type FlingDir = 'left' | 'right';

// Depth-based rest transforms (from the prototype's restTransform).
const REST = [
  { y: 0, z: 0, scale: 1, rotateX: 0, opacity: 1 },
  { y: 10, z: -48, scale: 0.955, rotateX: 2.5, opacity: 0.82 },
  { y: 20, z: -96, scale: 0.91, rotateX: 4, opacity: 0.6 },
];

function fling(dir: FlingDir) {
  return {
    x: dir === 'right' ? 640 : -640,
    y: -46,
    z: 180,
    rotateZ: dir === 'right' ? 12 : -12,
    rotateY: dir === 'right' ? -22 : 22,
    opacity: 0,
    transition: { duration: 0.46, ease: [0.5, 0, 0.75, 0] as const },
  };
}

const BASE_SHADOW =
  '0 28px 46px -16px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.04)';
const DRAG_SHADOW =
  '0 50px 70px -24px rgba(0,0,0,.85), 0 0 34px -6px rgba(230,180,90,.4)';

const VISIBLE = 3;

export function CardStack({
  deck,
  cursor,
  names,
  genders,
  dir,
  locked,
  reduced,
  onAdvance,
}: {
  deck: string[];
  cursor: number;
  names: [string, string];
  genders: [Gender, Gender];
  dir: FlingDir;
  locked: boolean;
  reduced: boolean;
  onAdvance: (dir: FlingDir) => void;
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
    if (passed) onAdvance(info.offset.x > 0 ? 'right' : 'left');
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
        <AnimatePresence custom={dir} initial={false}>
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
                  custom={dir}
                  className="absolute inset-0 rounded-3xl border border-line overflow-hidden will-change-transform"
                  style={{
                    background: faceGradient(meta.from, gender),
                    boxShadow: BASE_SHADOW,
                    transformStyle: 'preserve-3d',
                    zIndex: 50 - depth,
                    touchAction: 'none',
                    cursor: isTop && !locked ? 'grab' : 'default',
                  }}
                  initial={{ ...REST[depth], opacity: 0 }}
                  animate={REST[depth]}
                  variants={{ exit: (d: FlingDir) => fling(d) }}
                  exit="exit"
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
