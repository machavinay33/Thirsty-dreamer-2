/** Slow horizontal ticker. Decorative: hidden from assistive tech, paused for reduced-motion users. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 pr-8 font-serif text-2xl italic text-cream/70 md:text-4xl">
          {t}
          <span className="text-copper" aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="overflow-hidden border-y border-cream/15 bg-walnut/50 py-5" aria-hidden="true">
      <div className="marquee">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
