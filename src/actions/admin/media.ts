'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { MEDIA_SLOTS } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { formToObject, mediaMetaSchema } from '@/lib/validation';
import type { FormState } from '@/lib/types';

const PATH = /^(videos|posters|images)\/[A-Za-z0-9._-]+$/;
const SLOT_KEYS: string[] = MEDIA_SLOTS.map((s) => s.key);
const refresh = () => revalidatePath('/', 'layout');

export type NewMediaInput = {
  title: string; description?: string; category: string; alt_text?: string; captions?: string;
  sort_order?: number | string; featured?: boolean; status: string;
  storage_path: string; poster_path?: string | null;
};

/** Called from the browser AFTER the file has been uploaded straight to Storage as the signed-in user. */
export async function createMedia(input: NewMediaInput): Promise<FormState> {
  await requireStaff();
  const meta = mediaMetaSchema.safeParse(input);
  if (!meta.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: meta.error.flatten().fieldErrors };
  if (!SLOT_KEYS.includes(meta.data.category)) return { ok: false, message: 'Choose a valid slot.' };
  if (!PATH.test(input.storage_path) || (input.poster_path && !PATH.test(input.poster_path))) return { ok: false, message: 'Invalid storage path.' };

  const media_type = /\.(mp4|webm)$/i.test(input.storage_path) ? 'video' : 'image';
  const { error } = await (await createClient()).from('media_assets').insert({ ...meta.data, media_type, storage_path: input.storage_path, poster_path: input.poster_path || null });
  if (error) return { ok: false, message: `Could not save media: ${error.message}` };
  refresh();
  return { ok: true, message: meta.data.status === 'published' ? 'Uploaded and published.' : 'Uploaded as a draft. Publish it when you’re ready.' };
}

export async function updateMedia(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const meta = mediaMetaSchema.safeParse(formToObject(fd));
  if (!meta.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: meta.error.flatten().fieldErrors };
  if (!SLOT_KEYS.includes(meta.data.category)) return { ok: false, message: 'Choose a valid slot.' };
  const id = String(fd.get('id') ?? '');
  const { error } = await (await createClient()).from('media_assets').update(meta.data).eq('id', id);
  if (error) return { ok: false, message: `Could not save: ${error.message}` };
  refresh();
  return { ok: true, message: 'Saved.' };
}

export async function deleteMedia(fd: FormData): Promise<void> {
  await requireStaff();
  const id = String(fd.get('id') ?? '');
  const supabase = await createClient();
  const { data } = await supabase.from('media_assets').select('storage_path, poster_path').eq('id', id).maybeSingle();
  if (data) {
    const paths = [data.storage_path, data.poster_path].filter((p): p is string => Boolean(p) && PATH.test(p as string));
    if (paths.length) await supabase.storage.from('media').remove(paths);
    await supabase.from('media_assets').delete().eq('id', id);
  }
  refresh();
}
