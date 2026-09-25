import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import { getPosts } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const staticRoutes = ['', '/journal', '/events', '/consultation', '/contact'];
  return [
    ...staticRoutes.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/journal/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
