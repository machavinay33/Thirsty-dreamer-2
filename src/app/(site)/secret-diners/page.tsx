import type { Metadata } from 'next';
import { Reveal } from '@/components/public/Reveal';
import { SecretDiners } from '@/components/public/sections';
import { WaitlistForm } from '@/components/public/WaitlistForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Secret Diners — Join the Waitlist',
  description: 'Hidden menus. Intimate rooms. Pairings you don’t see coming. Join the Secret Diners waitlist in Toronto — strictly limited seats.',
  path: '/secret-diners',
});

export default function SecretDinersPage() {
  return (
    <>
      <SecretDiners asPage />
      <section id="waitlist" aria-labelledby="waitlist-title" className="bg-black pb-28">
        <div className="wrap max-w-2xl">
          <Reveal>
            <h2 id="waitlist-title" className="display-md">Join the waitlist</h2>
            <p className="mt-3 text-cream/70">Tell us where to find you. Joining doesn’t reserve a seat.</p>
            <div className="mt-8"><WaitlistForm /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
