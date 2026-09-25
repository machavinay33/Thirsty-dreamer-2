import Link from 'next/link';
import { ABOUT, COLLAB, CONSULT, CONTACT, EDITORIAL_STORIES, EVENTS, GALLERY, HERO, JOURNAL, MARQUEE_TEXT, MEDIA_SLOTS, SPEAKING } from '@/lib/content';
import type { EventRow, MediaAsset, Post } from '@/lib/types';
import { mediaUrl } from '@/lib/utils';
import { HeroMedia } from './HeroMedia';
import { InquiryForm } from './InquiryForm';
import { Marquee } from './Marquee';
import { MediaPlaceholder } from './MediaPlaceholder';
import { EventItem, FeaturedPost, PostRow } from './PostParts';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionHead';
import { VideoCard } from './VideoCard';

/* ------------------------------ Hero ------------------------------ */
export function Hero({ media }: { media?: MediaAsset }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <HeroMedia type={media?.media_type} src={mediaUrl(media?.storage_path)} poster={mediaUrl(media?.poster_path)} alt={media?.alt_text} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/30" />
      </div>
      <p className="vertical-label eyebrow absolute right-5 top-1/2 hidden -translate-y-1/2 text-cream/70 md:block md:right-10">Toronto</p>
      <div className="wrap pb-10 pt-32 md:pb-14">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1 id="hero-title" className="display-xl mt-5 max-w-5xl">
          <span className="block text-cream">Never Stop</span>
          <span className="block text-vermouth">Dreaming.</span>
        </h1>
        <p className="lede mt-6 max-w-xl">{HERO.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/journal" className="btn-primary">{HERO.primary}</Link>
          <Link href="/contact" className="btn-ghost">{HERO.secondary}</Link>
        </div>
        <ul className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-cream/20 pt-4 text-[0.7rem] font-medium uppercase tracking-label text-cream/70">
          {HERO.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeMarquee() {
  return <Marquee items={MARQUEE_TEXT} />;
}

/* ------------------------------ About ------------------------------ */
export function About({ media }: { media?: MediaAsset }) {
  const src = mediaUrl(media?.storage_path);
  return (
    <section id="about" aria-labelledby="about-title" className="section wrap grid gap-16 lg:grid-cols-12">
      <Reveal className="self-start lg:sticky lg:top-28 lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden border border-cream/15">
          {src && media?.media_type === 'video' ? (
            <video className="h-full w-full object-cover" controls muted loop playsInline preload="metadata" poster={mediaUrl(media.poster_path) ?? undefined} aria-label={media.alt_text || 'Massi behind the bar'}>
              <source src={src} />
            </video>
          ) : src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={media?.alt_text || 'Portrait of Massimo Zitti'} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <MediaPlaceholder label="Portrait or behind-the-bar clip" className="border-0" />
          )}
        </div>
        <blockquote className="relative z-10 -mt-14 ml-4 max-w-md border-l-2 border-copper bg-walnut p-6 md:ml-10">
          <p className="font-serif text-xl italic leading-snug text-cream md:text-2xl">{ABOUT.closingQuote}</p>
        </blockquote>
      </Reveal>

      <div className="lg:col-span-7 lg:pt-6">
        <Reveal>
          <SectionLabel index="01">{ABOUT.label}</SectionLabel>
          <h2 id="about-title" className="display-lg mt-6">{ABOUT.headline}</h2>
        </Reveal>
        <Reveal delay={80} className="mt-10 grid max-w-2xl gap-5 text-base leading-relaxed text-cream/80 md:text-lg">
          {ABOUT.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Editorial stories ------------------------------ */
export function EditorialStories() {
  return (
    <section aria-label="Massi's stories" className="border-y border-cream/10 bg-walnut/30">
      {EDITORIAL_STORIES.map((story, i) => (
        <article key={story.label} className="section wrap grid gap-10 border-b border-cream/10 last:border-b-0 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionLabel index={String(i + 2).padStart(2, '0')}>{story.label}</SectionLabel>
            <h2 className="display-lg mt-6">{story.headline}</h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-6 lg:col-start-7">
            <div className="grid gap-6 text-base leading-relaxed text-cream/80 md:text-lg">
              {story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </Reveal>
        </article>
      ))}
    </section>
  );
}

/* ------------------------------ Journal ------------------------------ */
export function JournalSection({ posts }: { posts: Post[] }) {
  const [first, ...rest] = posts;
  return (
    <section id="journal" aria-labelledby="journal-title" className="section border-y border-cream/10 bg-walnut/40">
      <div className="wrap">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="02">{JOURNAL.label}</SectionLabel>
            <h2 id="journal-title" className="display-md mt-6">{JOURNAL.headline}</h2>
          </div>
          <p className="lede self-end lg:col-span-4 lg:col-start-9">{JOURNAL.copy}</p>
        </Reveal>

        {first ? (
          <div className="mt-14 md:mt-20">
            <Reveal><FeaturedPost post={first} /></Reveal>
            <Reveal delay={80} className="mt-12">
              {rest.map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
              <div className="border-t border-cream/15" />
            </Reveal>
          </div>
        ) : (
          <p className="mt-14 border border-dashed border-cream/25 p-8 text-cream/70">New entries are on the way. The first notes from behind the bar will land here.</p>
        )}

        <div className="mt-10">
          <Link href="/journal" className="link-arrow">{JOURNAL.cta} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Speaking ------------------------------ */
export function Speaking() {
  return (
    <section id="speaking" aria-labelledby="speaking-title" className="section wrap">
      <Reveal className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="03">{SPEAKING.label}</SectionLabel>
          <h2 id="speaking-title" className="display-lg mt-6">{SPEAKING.headline}</h2>
        </div>
        <p className="lede self-end lg:col-span-4 lg:col-start-9">{SPEAKING.copy}</p>
      </Reveal>

      <div className="mt-16">
        {SPEAKING.offerings.map((o, i) => (
          <Reveal key={o.title} delay={i * 60}>
            <article className="group grid gap-4 border-t border-cream/20 py-10 lg:grid-cols-12 lg:gap-10">
              <h3 className="font-serif text-4xl leading-none text-cream transition-colors duration-200 group-hover:text-copper md:text-6xl lg:col-span-6">{o.title}</h3>
              <div className="lg:col-span-5 lg:col-start-8">
                <p className="eyebrow">{o.meta}</p>
                <p className="mt-3 text-cream/80">{o.copy}</p>
              </div>
            </article>
          </Reveal>
        ))}
        <div className="border-t border-cream/20" />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <Link href="/contact?type=speaking" className="btn-primary">{SPEAKING.cta} <span aria-hidden="true">→</span></Link>
        <p className="text-sm text-cream/65">{SPEAKING.note}</p>
      </div>
    </section>
  );
}

/* ------------------------------ Brand collaboration ------------------------------ */
export function Collaboration() {
  return (
    <section id="collaboration" aria-labelledby="collab-title" className="section border-y border-cream/10 bg-roast">
      <div className="wrap grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionLabel index="04">{COLLAB.label}</SectionLabel>
            <h2 id="collab-title" className="display-lg mt-6">{COLLAB.headline}</h2>
            <div className="mt-8 grid max-w-2xl gap-5 text-base leading-relaxed text-cream/80 md:text-lg">
              {COLLAB.copy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          <ol className="mt-14 grid gap-0">
            {COLLAB.steps.map((s, i) => (
              <li key={s.title} className="border-t border-cream/15">
                <Reveal delay={i * 70} className="grid grid-cols-[3.5rem_1fr] gap-4 py-7">
                  <span className="font-serif text-4xl italic text-copper" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-cream">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-cream/75">{s.copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={100} className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <figure className="border border-dashed border-copper/60 p-3">
              <div className="aspect-[4/5]">
                <MediaPlaceholder label="Reel preview" note="Example layout only" />
              </div>
              <figcaption className="mt-3 px-1 pb-1 text-[0.68rem] font-medium uppercase tracking-label text-cream/75">{COLLAB.exampleLabel}</figcaption>
            </figure>
            <div className="mt-10">
              <p className="eyebrow">{COLLAB.fitLabel}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {COLLAB.fit.map((f) => (
                  <li key={f} className="badge px-3 py-1.5 text-xs">{f}</li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/contact?type=brand_collaboration" className="btn-primary">{COLLAB.cta} <span aria-hidden="true">→</span></Link>
              <p className="text-sm text-cream/65">{COLLAB.note}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Video gallery ------------------------------ */
export function VideoGallery({ media }: { media: Record<string, MediaAsset | undefined> }) {
  const slots = MEDIA_SLOTS.filter((s) => s.gallery);
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section">
      <div className="wrap">
        <Reveal>
          <SectionLabel index="05">Video gallery</SectionLabel>
          <h2 id="gallery-title" className="display-lg mt-6">{GALLERY.label}</h2>
        </Reveal>
      </div>
      <div className="wrap mt-14">
        <ul className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-14 md:overflow-visible md:px-0" aria-label="Video gallery">
          {slots.map((slot) => {
            const m = media[slot.key];
            return (
              <li key={slot.key} className="w-[72%] shrink-0 snap-center sm:w-[45%] md:w-auto md:[&:nth-child(3n+2)]:mt-16">
                <VideoCard slotLabel={slot.label} src={mediaUrl(m?.storage_path)} poster={mediaUrl(m?.poster_path)} title={m?.title} description={m?.description} alt={m?.alt_text} captions={m?.captions} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ Events ------------------------------ */
export function EventsSection({ events }: { events: EventRow[] }) {
  const upcoming = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  return (
    <section id="events" aria-labelledby="events-title" className="section border-y border-cream/10 bg-walnut/40">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <SectionLabel index="06">{EVENTS.label}</SectionLabel>
          <h2 id="events-title" className="display-lg mt-6">{EVENTS.headline}</h2>
          <ul className="mt-10">
            {EVENTS.types.map((t) => (
              <li key={t} className="border-t border-cream/15 py-4 font-serif text-2xl text-cream/90 transition-[transform,color] duration-300 hover:translate-x-2 hover:text-copper md:text-3xl">{t}</li>
            ))}
            <li className="border-t border-cream/15" aria-hidden="true" />
          </ul>
        </Reveal>
        <Reveal delay={90} className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow">Upcoming</p>
          {upcoming.length ? (
            <div className="mt-4">{upcoming.map((e) => <EventItem key={e.id} event={e} />)}</div>
          ) : (
            <p className="mt-4 border border-dashed border-cream/25 p-6 text-cream/70">{EVENTS.empty}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact?type=event" className="btn-primary">{EVENTS.cta} <span aria-hidden="true">→</span></Link>
            <Link href="/events" className="btn-ghost">All events</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Consultation ------------------------------ */
export function ConsultationSection({ asPage = false }: { asPage?: boolean }) {
  const H = asPage ? 'h1' : 'h2';
  return (
    <section id="consultation" aria-labelledby="consult-title" className="section wrap grid gap-14 lg:grid-cols-12">
      <Reveal className="lg:col-span-6">
        <SectionLabel index={asPage ? undefined : '07'}>{CONSULT.label}</SectionLabel>
        <H id="consult-title" className="display-lg mt-6">{CONSULT.copy}</H>
      </Reveal>
      <Reveal delay={90} className="lg:col-span-5 lg:col-start-8">
        <ul>
          {CONSULT.areas.map((a) => (
            <li key={a} className="flex items-baseline gap-4 border-t border-cream/15 py-4 font-serif text-xl text-cream md:text-2xl">
              <span className="text-copper" aria-hidden="true">✦</span>
              {a}
            </li>
          ))}
          <li className="border-t border-cream/15" aria-hidden="true" />
        </ul>
        {!asPage && (
          <Link href="/consultation" className="btn-primary mt-8">{CONSULT.cta} <span aria-hidden="true">→</span></Link>
        )}
      </Reveal>
    </section>
  );
}

/* ------------------------------ Contact ------------------------------ */
export function ContactSection({ asPage = false, defaultType = 'contact' }: { asPage?: boolean; defaultType?: 'speaking' | 'brand_collaboration' | 'event' | 'consultation' | 'contact' }) {
  const H = asPage ? 'h1' : 'h2';
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-cream/10 bg-roast">
      <div className="wrap section grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel>Contact</SectionLabel>
          <H id="contact-title" className="display-lg mt-6">{CONTACT.headline}</H>
          <p className="lede mt-6">{CONTACT.copy}</p>
          <p className="mt-6 font-serif text-2xl italic text-copper">{CONTACT.tagline}</p>
          <div className="mt-8 grid gap-2 text-sm text-cream/80">
            <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-copper">{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replaceAll('-', '')}`} className="transition-colors hover:text-copper">{CONTACT.phone}</a>
          </div>
        </Reveal>
        <Reveal delay={90} className="lg:col-span-6 lg:col-start-7">
          <InquiryForm key={defaultType} defaultType={defaultType} />
        </Reveal>
      </div>
      <div className="overflow-hidden border-t border-cream/10 py-10 md:py-16" aria-hidden="true">
        <p className="wrap font-serif text-[clamp(2rem,8vw,7rem)] italic leading-none tracking-tight text-cream/90">{CONTACT.closing}</p>
      </div>
      <p className="sr-only">{CONTACT.closing}</p>
    </section>
  );
}
