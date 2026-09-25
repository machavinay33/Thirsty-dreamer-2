import Image from 'next/image';
import Link from 'next/link';
import { FOOTER_LINKS, INSTAGRAM_URL, MOTHER_URL } from '@/lib/content';

export function Footer() {
  return (
    <footer className="border-t border-cream/15 bg-roast">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/logo-cream.png" alt="Thirsty Dreamer" width={1000} height={666} className="h-24 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-cream/70">Cocktails, fermentation, hospitality, and the hard work of turning dreams into real drinks and real stories.</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="grid gap-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/80 transition-colors duration-200 hover:text-copper">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Find Massi</p>
          <ul className="grid gap-2 text-sm">
            <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition-colors duration-200 hover:text-copper">Instagram: @thirstydreamer</a></li>
            <li><a href={MOTHER_URL} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition-colors duration-200 hover:text-copper">Mother Cocktail Bar</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="wrap py-6 text-xs text-cream/60">© {new Date().getFullYear()} Thirsty Dreamer · Massimo Zitti · Toronto</p>
      </div>
    </footer>
  );
}
