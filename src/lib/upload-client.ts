import { createBrowserSupabase } from '@/lib/supabase/browser';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // matches Supabase free-plan limit and bucket limit
export const VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export function validateFile(file: File, kind: 'video' | 'image' | 'any'): string | null {
  const allowed = kind === 'video' ? VIDEO_TYPES : kind === 'image' ? IMAGE_TYPES : [...VIDEO_TYPES, ...IMAGE_TYPES];
  if (!allowed.includes(file.type)) return `Unsupported file type (${file.type || 'unknown'}). Allowed: ${allowed.map((t) => t.split('/')[1]).join(', ')}.`;
  if (file.size > MAX_UPLOAD_BYTES) return `File is ${(file.size / 1048576).toFixed(1)} MB. The limit is 50 MB — compress it first (see README).`;
  return null;
}

/**
 * Uploads a file straight from the browser to Supabase Storage as the signed-in staff user (RLS enforced),
 * using XHR so we can report upload progress. Returns the storage path inside the "media" bucket.
 */
export async function uploadToStorage(file: File, folder: 'videos' | 'posters' | 'images', onProgress?: (pct: number) => void): Promise<string> {
  const supabase = createBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Your session has expired. Please sign in again.');

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'file';
  const path = `${folder}/${crypto.randomUUID()}-${base}.${ext}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/media/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = `Upload failed (${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.message) msg = `Upload failed: ${body.message}`;
      } catch {}
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error('Network error during upload. Check your connection and try again.'));
    const form = new FormData();
    form.append('cacheControl', '31536000');
    form.append('', file);
    xhr.send(form);
  });
  onProgress?.(100);
  return path;
}
