/** Slow horizontal ticker. Decorative: hidden from assistive tech, paused for reduced-motion users. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 pr-8 font-display text-2xl uppercase tracking-[-0.04em] text-cream/80 md:text-5xl">
          {t}
          <span className="text-olive" aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="overflow-hidden border-y border-cream/15 bg-roast py-6" aria-hidden="true">
      <div className="marquee">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
