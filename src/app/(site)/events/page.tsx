import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/public/JsonLd';
import { EventItem } from '@/components/public/PostParts';
import { Reveal } from '@/components/public/Reveal';
import { SectionLabel } from '@/components/public/SectionHead';
import { EVENTS } from '@/lib/content';
import { getEvents } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: 'Events & Activations',
  description: 'Pop-ups, takeovers, activations, guest shifts, and private hospitality experiences with Massimo Zitti in Toronto.',
  path: '/events',
});

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status === 'upcoming');
  const past = events.filter((e) => e.status === 'past');

  const ld = upcoming
    .filter((e) => e.event_date)
    .map((e) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: e.title,
      startDate: e.event_date,
      description: e.description ?? undefined,
      url: e.external_url ?? absoluteUrl('/events'),
      location: { '@type': 'Place', name: e.venue ?? e.city ?? 'Toronto', address: e.city ?? 'Toronto' },
      organizer: { '@type': 'Person', name: 'Massimo Zitti' },
    }));

  return (
    <div className="section wrap">
      {ld.length ? <JsonLd data={ld} /> : null}
      <Reveal>
        <SectionLabel>{EVENTS.label}</SectionLabel>
        <h1 className="display-lg mt-6 max-w-4xl">{EVENTS.headline}</h1>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Formats">
          {EVENTS.types.map((t) => <li key={t} className="badge px-3 py-1.5 text-xs">{t}</li>)}
        </ul>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <section aria-labelledby="up-title">
          <h2 id="up-title" className="display-md">Upcoming</h2>
          <div className="mt-6">
            {upcoming.length ? upcoming.map((e) => <EventItem key={e.id} event={e} />) : <p className="border border-dashed border-cream/25 p-6 text-cream/70">{EVENTS.empty}</p>}
          </div>
        </section>
        <section aria-labelledby="past-title">
          <h2 id="past-title" className="display-md">Past</h2>
          <div className="mt-6">
            {past.length ? past.map((e) => <EventItem key={e.id} event={e} />) : <p className="border border-dashed border-cream/25 p-6 text-cream/70">Past events will be archived here.</p>}
          </div>
        </section>
      </div>

      <div className="mt-16">
        <Link href="/contact?type=event" className="btn-primary">{EVENTS.cta} <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
