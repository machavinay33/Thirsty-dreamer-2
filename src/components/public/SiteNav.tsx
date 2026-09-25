'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '@/lib/content';
import { cn } from '@/lib/utils';

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close the menu on navigation
  useEffect(() => close(), [pathname, close]);

  // Active section indication on the homepage
  useEffect(() => {
    if (pathname !== '/') {
      setSection(null);
      return;
    }
    const ids = NAV_LINKS.flatMap((l) => ('section' in l ? [l.section] : []));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setSection(hit.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Menu: lock scroll, Escape to close, focus management
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        toggleBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const isActive = (l: (typeof NAV_LINKS)[number]) => {
    if ('section' in l) return pathname === '/' && section === l.section;
    return pathname === l.href || pathname.startsWith(`${l.href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-espresso/90 backdrop-blur-xl">
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="group flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.05em] text-cream md:text-xl" aria-label="Thirsty Dreamer — home">
          THIRSTY DREAMER<span className="text-olive transition-transform group-hover:translate-x-1">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l) ? 'page' : undefined}
                  className={cn('border-b border-transparent pb-1 text-cream/60 transition-colors duration-200 hover:text-olive', isActive(l) && 'border-olive text-cream')}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleBtn}
          type="button"
          className="flex h-11 items-center gap-3 border border-cream/25 px-4 text-sm text-cream transition-colors duration-200 hover:border-copper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <Link href="/contact" className="hidden border border-olive bg-olive px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-espresso transition-transform hover:-translate-y-0.5 lg:block">Start a project</Link>
      </div>

      <div
        id="mobile-menu"
        data-open={open}
        inert={!open}
        className={cn('menu-panel fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-espresso lg:hidden', open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0')}
      >
        <nav aria-label="Mobile" className="wrap py-8">
          <ul className="divide-y divide-cream/10">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={l.href}
                  onClick={close}
                  aria-current={isActive(l) ? 'page' : undefined}
                  className={cn('flex items-baseline justify-between py-4 font-serif text-3xl text-cream transition-colors duration-200 hover:text-copper', isActive(l) && 'text-copper')}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs uppercase tracking-label text-cream/50">Toronto · Never stop dreaming</p>
        </nav>
      </div>
    </header>
  );
}
