'use client';

/** Presentational inner content of a card (no motion). */
export function CardFace({
  categoryName,
  categoryColor,
  text,
  turnLabel,
}: {
  categoryName: string;
  categoryColor: string;
  text: string;
  turnLabel: string | null;
}) {
  return (
    <>
      {/* glossy surface highlight — a soft top-left light gives the face a 3D feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl z-[1]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 20%, transparent 44%)',
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
            className="m-0 font-card font-bold text-center text-ink"
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
