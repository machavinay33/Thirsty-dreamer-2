import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { hasSupabase } from '@/lib/env';
import type { EventRow, MediaAsset, Post } from '@/lib/types';

/** Public, RLS-protected reads. Every function fails soft (returns empty) so the site still builds without env vars. */

const POST_LIST_COLUMNS = 'id,title,slug,category,excerpt,cover_image_url,author_name,published_at,status,body_markdown,video_url,seo_title,seo_description,social_image_url,created_at,updated_at';

export async function getPosts(opts: { limit?: number; category?: string } = {}): Promise<Post[]> {
  if (!hasSupabase) return [];
  try {
    let q = createPublicClient()
      .from('posts')
      .select(POST_LIST_COLUMNS)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });
    if (opts.category) q = q.eq('category', opts.category);
    if (opts.limit) q = q.limit(opts.limit);
    const { data } = await q;
    return (data as Post[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getPostCategories(): Promise<string[]> {
  if (!hasSupabase) return [];
  try {
    const { data } = await createPublicClient().from('posts').select('category').eq('status', 'published');
    return Array.from(new Set((data ?? []).map((r: { category: string }) => r.category))).sort();
  } catch {
    return [];
  }
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  if (!hasSupabase) return null;
  try {
    const { data } = await createPublicClient().from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
    return (data as Post | null) ?? null;
  } catch {
    return null;
  }
});

export async function getEvents(): Promise<EventRow[]> {
  if (!hasSupabase) return [];
  try {
    const { data } = await createPublicClient()
      .from('events')
      .select('*')
      .in('status', ['upcoming', 'past'])
      .order('event_date', { ascending: false, nullsFirst: false });
    return (data as EventRow[] | null) ?? [];
  } catch {
    return [];
  }
}

/** Published media keyed by slot; one asset per slot (featured first, then sort_order, then newest). */
export async function getMediaBySlot(): Promise<Record<string, MediaAsset | undefined>> {
  if (!hasSupabase) return {};
  try {
    const { data } = await createPublicClient()
      .from('media_assets')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    const map: Record<string, MediaAsset | undefined> = {};
    for (const row of (data as MediaAsset[] | null) ?? []) if (!map[row.category]) map[row.category] = row;
    return map;
  } catch {
    return {};
  }
}
