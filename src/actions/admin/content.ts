'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eventSchema, formToObject, postSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import type { FormState } from '@/lib/types';

const refreshSite = () => revalidatePath('/', 'layout');
const toTimestamp = (d: string | null) => (d ? `${d}T12:00:00Z` : null);

function dbError(error: { code?: string; message: string }): FormState {
  if (error.code === '23505') return { ok: false, message: 'That slug is already in use. Choose a different one.', errors: { slug: ['Already in use'] } };
  if (error.code === '42501') return { ok: false, message: 'You do not have permission to do that.' };
  console.error('admin db error', error.message);
  return { ok: false, message: `Could not save: ${error.message}` };
}

/* ------------------------------- Posts ------------------------------- */
export async function savePost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const parsed = postSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: parsed.error.flatten().fieldErrors };

  const d = parsed.data;
  const slug = d.slug || slugify(d.title);
  if (!slug) return { ok: false, message: 'Add a slug or a title with letters or numbers.', errors: { slug: ['Required'] } };
  const published_at = d.status === 'published' ? toTimestamp(d.published_at) ?? new Date().toISOString() : toTimestamp(d.published_at);
  const row = { ...d, slug, published_at };

  const supabase = await createClient();
  const id = String(fd.get('id') ?? '');
  if (id) {
    const { error } = await supabase.from('posts').update(row).eq('id', id);
    if (error) return dbError(error);
    refreshSite();
    return { ok: true, message: d.status === 'published' ? 'Saved and published.' : 'Draft saved.' };
  }
  const { data, error } = await supabase.from('posts').insert(row).select('id').single();
  if (error || !data) return dbError(error ?? { message: 'Unknown error' });
  refreshSite();
  redirect(`/admin/posts/${data.id}?created=1`);
}

export async function deletePost(fd: FormData): Promise<void> {
  await requireStaff();
  const id = String(fd.get('id') ?? '');
  if (id) await (await createClient()).from('posts').delete().eq('id', id);
  refreshSite();
  redirect('/admin/posts');
}

/* ------------------------------- Events ------------------------------- */
export async function saveEvent(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const parsed = eventSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: parsed.error.flatten().fieldErrors };

  const d = parsed.data;
  const slug = d.slug || slugify(d.title);
  if (!slug) return { ok: false, message: 'Add a slug or a title with letters or numbers.', errors: { slug: ['Required'] } };
  const row = { ...d, slug };

  const supabase = await createClient();
  const id = String(fd.get('id') ?? '');
  if (id) {
    const { error } = await supabase.from('events').update(row).eq('id', id);
    if (error) return dbError(error);
    refreshSite();
    return { ok: true, message: 'Event saved.' };
  }
  const { data, error } = await supabase.from('events').insert(row).select('id').single();
  if (error || !data) return dbError(error ?? { message: 'Unknown error' });
  refreshSite();
  redirect(`/admin/events/${data.id}?created=1`);
}

export async function deleteEvent(fd: FormData): Promise<void> {
  await requireStaff();
  const id = String(fd.get('id') ?? '');
  if (id) await (await createClient()).from('events').delete().eq('id', id);
  refreshSite();
  redirect('/admin/events');
}
