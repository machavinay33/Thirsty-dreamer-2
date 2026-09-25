import type { Metadata } from 'next';
import { InquiryForm } from '@/components/public/InquiryForm';
import { Reveal } from '@/components/public/Reveal';
import { ConsultationSection } from '@/components/public/sections';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Consultation & Creative Direction',
  description: 'Hospitality consulting for people building rooms, rituals, products, and experiences with heart — concept development, beverage direction, fermentation, experience design, storytelling, and team workshops.',
  path: '/consultation',
});

export default function ConsultationPage() {
  return (
    <>
      <ConsultationSection asPage />
      <section aria-labelledby="consult-form-title" className="border-t border-cream/10 bg-roast py-20">
        <div className="wrap max-w-2xl">
          <Reveal>
            <h2 id="consult-form-title" className="display-md">Talk to Massi</h2>
            <div className="mt-8"><InquiryForm defaultType="consultation" lockType submitLabel="Send consultation inquiry" /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
