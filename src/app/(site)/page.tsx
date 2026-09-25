import type { Metadata } from 'next';
import { JsonLd } from '@/components/public/JsonLd';
import { About, Collaboration, ConsultationSection, ContactSection, EventsSection, Hero, HomeMarquee, JournalSection, SecretDiners, Speaking, VideoGallery } from '@/components/public/sections';
import { getEvents, getMediaBySlot, getPosts } from '@/lib/data';
import { INSTAGRAM_URL } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'Thirsty Dreamer — Massimo Zitti | Cocktails, Hospitality & Stories',
  description:
    'The journal and creative studio of Massimo “Massi” Zitti: cocktails, fermentation, hospitality, sustainability, speaking, collaborations, events, and experiences in Toronto.',
  path: '/',
  absoluteTitle: true,
});

export default async function HomePage() {
  const [posts, media, events] = await Promise.all([getPosts({ limit: 4 }), getMediaBySlot(), getEvents()]);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Massimo Zitti',
    alternateName: 'Massi',
    jobTitle: 'Bartender, entrepreneur and hospitality creative',
    url: absoluteUrl('/'),
    address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressCountry: 'CA' },
    sameAs: [INSTAGRAM_URL],
  };
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Thirsty Dreamer',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo-cream.png'),
    founder: { '@type': 'Person', name: 'Massimo Zitti' },
    sameAs: [INSTAGRAM_URL],
  };

  return (
    <>
      <JsonLd data={[person, org]} />
      <Hero media={media.hero} />
      <HomeMarquee />
      <About media={media.about} />
      <JournalSection posts={posts} />
      <Speaking />
      <Collaboration />
      <VideoGallery media={media} />
      <EventsSection events={events} />
      <SecretDiners />
      <ConsultationSection />
      <ContactSection />
    </>
  );
}
