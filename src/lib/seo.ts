import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/utils';

export function buildMetadata({ title, description, path, image, absoluteTitle }: { title: string; description: string; path: string; image?: string | null; absoluteTitle?: boolean }): Metadata {
  const url = absoluteUrl(path);
  const images = [{ url: image || '/og.png' }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Thirsty Dreamer', type: 'website', locale: 'en_CA', images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}
