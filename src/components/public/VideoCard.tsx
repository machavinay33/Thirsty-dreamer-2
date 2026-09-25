'use client';

import { useRef, useState } from 'react';
import { cn, videoMime } from '@/lib/utils';
import { GALLERY } from '@/lib/content';

export type VideoCardProps = {
  slotLabel: string;
  src?: string | null;
  poster?: string | null;
  title?: string;
  description?: string | null;
  alt?: string | null;
  captions?: string | null;
  className?: string;
};

/** One gallery slot. Nothing loads until the visitor presses play (preload="none"). Always muted + inline by default. */
export function VideoCard({ slotLabel, src, poster, title, description, alt, captions, className }: VideoCardProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!src) {
    return (
      <figure className={cn('flex flex-col', className)}>
        <div className="flex aspect-[9/16] flex-col items-center justify-center gap-3 border border-dashed border-cream/25 bg-roast/60 p-6 text-center">
          <span className="font-serif text-2xl italic text-cream/50" aria-hidden="true">✦</span>
          <p className="text-sm text-cream/70">{GALLERY.empty}</p>
        </div>
        <figcaption className="mt-3 text-xs uppercase tracking-label text-cream/60">{slotLabel}</figcaption>
      </figure>
    );
  }

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <figure className={cn('group flex flex-col', className)}>
      <div className="relative aspect-[9/16] overflow-hidden border border-cream/15 bg-roast">
        <video
          ref={ref}
          className="zoom-hover h-full w-full object-cover"
          muted
          playsInline
          controls={playing}
          preload="none"
          poster={poster ?? undefined}
          aria-label={alt || title || slotLabel}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={src} type={videoMime(src)} />
        </video>
        {!playing && (
          <button type="button" onClick={toggle} aria-label={`Play video: ${title || slotLabel}`} className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-espresso/80 via-transparent to-transparent p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/60 bg-espresso/50 text-cream backdrop-blur transition-colors duration-200 group-hover:border-copper group-hover:text-copper">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <p className="text-xs uppercase tracking-label text-copper">{slotLabel}</p>
        {title ? <p className="mt-1 font-serif text-xl text-cream">{title}</p> : null}
        {description ? <p className="mt-1 text-sm text-cream/70">{description}</p> : null}
        {captions ? (
          <details className="mt-2 text-sm text-cream/70">
            <summary className="cursor-pointer text-cream/80 underline-offset-4 hover:underline">Transcript</summary>
            <p className="mt-2 whitespace-pre-line">{captions}</p>
          </details>
        ) : null}
      </figcaption>
    </figure>
  );
}
