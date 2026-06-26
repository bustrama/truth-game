'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { QUESTION_MAP } from '@/lib/questions';
import { categoryMeta } from '@/lib/categories';
import { faceGradient, genderForIdx, turnFor } from '@/lib/deckView';
import type { Gender, Question } from '@/lib/types';
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

// Layered drop + inner bevel shadows give the card physical depth.
const BASE_SHADOW =
  '0 30px 50px -16px rgba(0,0,0,.78), 0 12px 22px -10px rgba(0,0,0,.55), ' +
  'inset 0 1px 0 rgba(255,255,255,.07), inset 0 -28px 56px -28px rgba(0,0,0,.55)';
const DRAG_SHADOW =
  '0 60px 84px -24px rgba(0,0,0,.9), 0 18px 30px -12px rgba(0,0,0,.6), ' +
  'inset 0 1px 0 rgba(255,255,255,.1), inset 0 -28px 56px -28px rgba(0,0,0,.5)';

const VISIBLE = 4;

interface CardItem {
  id: string;
  q: Question;
  depth: number;
  absIdx: number;
}

function StackCard({
  item,
  isTop,
  locked,
  reduced,
  names,
  genders,
  onDragEnd,
}: {
  item: CardItem;
  isTop: boolean;
  locked: boolean;
  reduced: boolean;
  names: [string, string];
  genders: [Gender, Gender];
  onDragEnd: (info: PanInfo) => void;
}) {
  const { q, depth, absIdx } = item;
  const meta = categoryMeta(q.category);
  const gender = genderForIdx(absIdx, genders);
  const turn = turnFor(absIdx, names);

  // Drag-driven 3D tilt: moving the card horizontally turns it in Y (and a hair
  // in Z), like holding a physical card. A specular band sweeps with the tilt.
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-240, 240], [15, -15], { clamp: true });
  const specularX = useTransform(x, [-240, 240], [70, -70], { clamp: true });
  // Specular is invisible at rest and only sweeps in while the card is tilted.
  const specularOpacity = useTransform(x, [-120, 0, 120], [1, 0, 1], {
    clamp: true,
  });

  const face = (
    <CardFace
      categoryName={meta.name}
      categoryColor={meta.color}
      text={q.text}
      turnLabel={turn}
    />
  );

  if (reduced) {
    return (
      <motion.div
        className="absolute inset-0 rounded-3xl border border-line overflow-hidden"
        style={{ background: faceGradient(meta.from, gender), boxShadow: BASE_SHADOW }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {face}
      </motion.div>
    );
  }

  const rest = REST[Math.min(depth, REST.length - 1)];

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl border border-line overflow-hidden will-change-transform"
      style={{
        background: faceGradient(meta.from, gender),
        boxShadow: BASE_SHADOW,
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 100%',
        zIndex: 50 - depth,
        touchAction: 'none',
        cursor: isTop && !locked ? 'grab' : 'default',
        // x + rotateY are driven by the live drag (only the top card moves);
        // y/z/scale/rotateX/rotateZ/opacity come from `animate` below.
        x: isTop ? x : 0,
        rotateY: isTop ? rotateY : 0,
      }}
      initial={{ ...rest, opacity: 0 }}
      animate={rest}
      exit={TUCK_EXIT}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      drag={isTop && !locked ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.7}
      whileDrag={{ cursor: 'grabbing', boxShadow: DRAG_SHADOW }}
      onDragEnd={(_, info) => onDragEnd(info)}
    >
      {/* moving specular highlight — only meaningful on the top (interactive) card */}
      {isTop && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-[1]"
          style={{
            left: '25%',
            width: '50%',
            x: specularX,
            opacity: specularOpacity,
            background:
              'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)',
          }}
        />
      )}
      {face}
    </motion.div>
  );
}

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

  const window: CardItem[] = [];
  for (let d = 0; d < depthCount; d++) {
    const absIdx = cursor + d;
    const id = deck[absIdx];
    if (!id) break;
    const q = QUESTION_MAP.get(id);
    if (!q) break;
    window.push({ id, q, depth: d, absIdx });
  }

  function handleDragEnd(info: PanInfo) {
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
          perspective: 1000,
        }}
      >
        <AnimatePresence initial={false}>
          {window
            .slice()
            .reverse() /* render deepest first so the top card is last in DOM */
            .map((item) => (
              <StackCard
                key={item.id}
                item={item}
                isTop={item.depth === 0}
                locked={locked}
                reduced={reduced}
                names={names}
                genders={genders}
                onDragEnd={handleDragEnd}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
