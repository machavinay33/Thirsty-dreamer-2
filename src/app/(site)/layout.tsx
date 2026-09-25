import { Footer } from '@/components/public/Footer';
import { SiteNav } from '@/components/public/SiteNav';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[70] bg-cream px-4 py-2 text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <SiteNav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
