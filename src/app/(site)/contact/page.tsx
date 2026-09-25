import type { Metadata } from 'next';
import { ContactSection } from '@/components/public/sections';
import { INQUIRY_TYPES } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Speaking, brand collaborations, events, consultation, or a table that doesn’t officially exist — send Massimo Zitti a message.',
  path: '/contact',
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const match = INQUIRY_TYPES.find((t) => t.value === type)?.value ?? 'contact';
  return <ContactSection asPage defaultType={match} />;
}
