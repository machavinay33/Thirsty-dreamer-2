import Link from 'next/link';
import { formatDate, mediaUrl, cn } from '@/lib/utils';
import type { EventRow, Post } from '@/lib/types';

export function Cover({ src, alt = '', label, className }: { src?: string | null; alt?: string; label?: string; className?: string }) {
  const url = mediaUrl(src);
  if (url) {
    // Plain <img>: cover URLs may point at any host, so we avoid next/image's host allow-list here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} loading="lazy" decoding="async" className={cn('h-full w-full object-cover', className)} />;
  }
  return (
    <div className={cn('flex h-full w-full items-end bg-gradient-to-br from-walnut via-roast to-espresso p-5', className)} aria-hidden="true">
      <span className="eyebrow">{label}</span>
    </div>
  );
}

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group grid gap-6 md:grid-cols-12 md:items-end">
      <div className="relative aspect-[4/3] overflow-hidden border border-cream/15 md:col-span-7">
        <Cover src={post.cover_image_url} alt="" label={post.category} className="zoom-hover" />
      </div>
      <div className="md:col-span-5">
        <p className="eyebrow">{post.category}</p>
        <h3 className="display-md mt-3 transition-colors duration-200 group-hover:text-copper">{post.title}</h3>
        {post.excerpt ? <p className="mt-3 text-cream/75">{post.excerpt}</p> : null}
        <p className="mt-4 text-xs text-cream/55">{formatDate(post.published_at)}</p>
      </div>
    </Link>
  );
}

export function PostRow({ post, withImage = false }: { post: Post; withImage?: boolean }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group grid items-center gap-4 border-t border-cream/15 py-6 md:grid-cols-[9rem_1fr_auto] md:gap-8">
      {withImage ? (
        <div className="relative hidden aspect-[4/3] overflow-hidden border border-cream/10 md:block">
          <Cover src={post.cover_image_url} label={post.category} className="zoom-hover" />
        </div>
      ) : (
        <p className="text-xs text-cream/55">{formatDate(post.published_at)}</p>
      )}
      <div>
        <p className="eyebrow">{post.category}</p>
        <h3 className="mt-1.5 font-serif text-2xl text-cream transition-colors duration-200 group-hover:text-copper md:text-3xl">{post.title}</h3>
        {post.excerpt ? <p className="mt-2 max-w-xl text-sm text-cream/70">{post.excerpt}</p> : null}
      </div>
      <span aria-hidden="true" className="hidden text-copper transition-transform duration-200 group-hover:translate-x-1 md:block">→</span>
    </Link>
  );
}

export function EventItem({ event }: { event: EventRow }) {
  const body = (
    <div className="grid gap-4 border-t border-cream/15 py-6 sm:grid-cols-[8rem_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden border border-cream/10 sm:aspect-square">
        <Cover src={event.image_url} label={event.event_type ?? 'Event'} />
      </div>
      <div>
        <p className="eyebrow">{[event.event_type, event.status === 'past' ? 'Past' : 'Upcoming'].filter(Boolean).join(' · ')}</p>
        <h3 className="mt-1.5 font-serif text-2xl text-cream">{event.title}</h3>
        <p className="mt-1 text-sm text-cream/70">{[event.venue, event.city, event.event_date ? formatDate(event.event_date) : null].filter(Boolean).join(' · ')}</p>
        {event.description ? <p className="mt-2 max-w-xl text-sm text-cream/75">{event.description}</p> : null}
        {event.external_url ? <span className="link-arrow mt-3">Event details <span aria-hidden="true">→</span></span> : null}
      </div>
    </div>
  );
  return event.external_url ? (
    <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="group block">{body}</a>
  ) : (
    body
  );
}
