import type { Metadata, Viewport } from 'next';
import { DM_Mono, DM_Sans, Space_Grotesk } from 'next/font/google';
import { SITE_URL } from '@/lib/env';
import './globals.css';

// A sharp grotesk display face, neutral sans body copy, and mono utility labels.
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['400', '500', '600', '700'] });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400', '500'] });

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

export const viewport: Viewport = { themeColor: '#0c0c0b', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
