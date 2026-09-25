'use client';

import { useEffect, useRef, useState } from 'react';
import { MediaPlaceholder } from './MediaPlaceholder';
import { videoMime } from '@/lib/utils';

/**
 * Full-bleed hero media. Video is muted, inline, preload="none" (no bytes until it plays) and only
 * auto-plays when the visitor has not asked for reduced motion / data saving. A play/pause control is always available.
 */
export function HeroMedia({ type, src, poster, alt }: { type?: 'video' | 'image'; src?: string | null; poster?: string | null; alt?: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    if (!reduce && !saveData && wide) v.play().catch(() => undefined);
  }, []);

  if (!src) return <MediaPlaceholder label="Hero portrait or video — Massi behind the bar" className="border-0" />;

  if (type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || 'Massi behind the bar'} className="h-full w-full object-cover" />;
  }

  return (
    <>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={poster ?? undefined}
        aria-label={alt || 'Massi behind the bar'}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type={videoMime(src)} />
      </video>
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
        className="absolute right-5 top-24 z-10 border border-cream/40 bg-espresso/60 px-3 py-2 text-xs text-cream backdrop-blur transition-colors duration-200 hover:border-copper hover:text-copper md:right-10"
        aria-label={playing ? 'Pause hero video' : 'Play hero video'}
      >
        {playing ? 'Pause' : 'Play'}
      </button>
    </>
  );
}
