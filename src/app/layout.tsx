import type { Metadata, Viewport } from 'next';
import { Cherry_Bomb_One, DM_Sans, Playfair_Display } from 'next/font/google';
import { SITE_URL } from '@/lib/env';
import './globals.css';

// A hand-drawn display face for the hero, with a restrained sans for body/UI copy.
const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'] });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Cherry_Bomb_One({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: '400' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Thirsty Dreamer — Massimo Zitti | Cocktails, Hospitality & Stories',
    template: '%s | Thirsty Dreamer',
  },
  description:
    'The journal and creative studio of Massimo “Massi” Zitti: cocktails, fermentation, hospitality, sustainability, speaking, collaborations, events, and experiences in Toronto.',
  applicationName: 'Thirsty Dreamer',
  authors: [{ name: 'Massimo Zitti' }],
  openGraph: { type: 'website', siteName: 'Thirsty Dreamer', locale: 'en_CA', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Thirsty Dreamer logo' }] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = { themeColor: '#232113', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <head>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
