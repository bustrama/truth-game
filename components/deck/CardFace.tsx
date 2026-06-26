'use client';

/** Presentational inner content of a card (no motion). */
export function CardFace({
  categoryName,
  categoryColor,
  text,
  turnLabel,
  isTop,
}: {
  categoryName: string;
  categoryColor: string;
  text: string;
  turnLabel: string | null;
  isTop: boolean;
}) {
  return (
    <>
      {/* gold edge accent bar */}
      <div
        aria-hidden
        className="absolute top-3.5 bottom-3.5 w-1 rounded z-[3] transition-[opacity,box-shadow] duration-300"
        style={{
          insetInlineEnd: 0,
          background: 'linear-gradient(180deg, #F2D49A, #E6B45A)',
          boxShadow: `0 0 22px 3px rgba(230,180,90,${isTop ? 0.6 : 0.25})`,
          opacity: isTop ? 1 : 0.5,
        }}
      />
      <div className="relative z-[2] flex flex-col h-full justify-between px-6 py-[26px]">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="w-[9px] h-[9px] rounded-full flex-none"
            style={{
              background: categoryColor,
              boxShadow: `0 0 10px 1px ${categoryColor}88`,
            }}
          />
          <span className="text-[13px] font-semibold text-muted-3">
            {categoryName}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p
            className="m-0 font-serif font-bold text-center text-ink"
            style={{
              fontSize: 'clamp(25px, 6.6vw, 33px)',
              lineHeight: 1.34,
              textWrap: 'pretty',
            }}
          >
            {text}
          </p>
        </div>
        {turnLabel ? (
          <div className="text-center text-[13px] text-gold font-semibold">
            {turnLabel}
          </div>
        ) : (
          <div className="h-[18px]" />
        )}
      </div>
    </>
  );
}
