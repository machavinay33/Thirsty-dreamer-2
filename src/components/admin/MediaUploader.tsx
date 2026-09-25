'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMedia } from '@/actions/admin/media';
import { CheckField, FormMessage, SelectField, TextField } from '@/components/ui/fields';
import { MEDIA_SLOTS } from '@/lib/content';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { uploadToStorage, validateFile } from '@/lib/upload-client';
import type { FormState } from '@/lib/types';

export function MediaUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [slot, setSlot] = useState<string>('behind-the-bar');
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState('');
  const [state, setState] = useState<FormState | null>(null);
  const e = state?.errors ?? {};

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const file = fd.get('file') as File | null;
    const poster = fd.get('poster') as File | null;
    const kind = MEDIA_SLOTS.find((s) => s.key === slot)?.kind ?? 'any';

    if (!file || file.size === 0) return setState({ ok: false, message: 'Choose a video or image file to upload.' });
    const bad = validateFile(file, kind === 'video' ? 'video' : 'any') ?? (poster && poster.size > 0 ? validateFile(poster, 'image') : null);
    if (bad) return setState({ ok: false, message: bad });

    setBusy(true);
    setState(null);
    const uploaded: string[] = [];
    try {
      setStage('Uploading file…');
      setPct(0);
      const isVideo = file.type.startsWith('video/');
      const storage_path = await uploadToStorage(file, isVideo ? 'videos' : 'images', setPct);
      uploaded.push(storage_path);
      let poster_path: string | null = null;
      if (poster && poster.size > 0) {
        setStage('Uploading poster…');
        setPct(0);
        poster_path = await uploadToStorage(poster, 'posters', setPct);
        uploaded.push(poster_path);
      }
      setStage('Saving…');
      const res = await createMedia({
        title: String(fd.get('title') ?? ''),
        description: String(fd.get('description') ?? ''),
        category: slot,
        alt_text: String(fd.get('alt_text') ?? ''),
        captions: String(fd.get('captions') ?? ''),
        sort_order: String(fd.get('sort_order') ?? '0'),
        featured: fd.get('featured') === 'on',
        status: String(fd.get('status') ?? 'draft'),
        storage_path,
        poster_path,
      });
      setState(res);
      if (res.ok) {
        formRef.current?.reset();
        setSlot('behind-the-bar');
        router.refresh();
      } else {
        await createBrowserSupabase().storage.from('media').remove(uploaded); // don't leave orphaned files behind
      }
    } catch (err) {
      setState({ ok: false, message: (err as Error).message });
      if (uploaded.length) await createBrowserSupabase().storage.from('media').remove(uploaded);
    } finally {
      setBusy(false);
      setStage('');
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card grid gap-5" aria-busy={busy}>
      <h2 className="font-serif text-2xl text-cream">Upload media</h2>
      <SelectField label="Slot" name="slot" value={slot} onChange={setSlot} options={MEDIA_SLOTS.map((s) => ({ value: s.key, label: s.label }))} hint="Each slot shows one published asset on the site (featured first, then lowest sort order)." />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="f-file" className="label">Video (MP4 / WebM) or image <span aria-hidden="true" className="text-copper">*</span></label>
          <input id="f-file" name="file" type="file" required accept="video/mp4,video/webm,image/jpeg,image/png,image/webp,image/avif" className="input file:mr-3 file:border-0 file:bg-walnut file:px-3 file:py-1.5 file:text-cream" />
          <span className="hint">Max 50 MB. Compress large portrait videos first (see README).</span>
        </div>
        <div>
          <label htmlFor="f-poster" className="label">Poster image <span className="ml-1 text-xs font-normal text-cream/50">(recommended for video)</span></label>
          <input id="f-poster" name="poster" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="input file:mr-3 file:border-0 file:bg-walnut file:px-3 file:py-1.5 file:text-cream" />
        </div>
      </div>
      <TextField label="Title" name="title" required maxLength={200} error={e.title} />
      <TextField label="Description" name="description" rows={2} maxLength={1000} error={e.description} />
      <TextField label="Alt text" name="alt_text" maxLength={300} hint="Describe what’s happening for people using screen readers." error={e.alt_text} />
      <TextField label="Captions / transcript" name="captions" rows={3} hint="Shown under the video as a transcript." error={e.captions} />
      <div className="grid gap-5 md:grid-cols-3">
        <TextField label="Sort order" name="sort_order" type="number" defaultValue={0} error={e.sort_order} />
        <SelectField label="Status" name="status" defaultValue="draft" options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
        <div className="self-end pb-3"><CheckField name="featured" label="Featured" /></div>
      </div>

      {busy ? (
        <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="h-2 bg-cream/15"><div className="h-full bg-copper transition-[width] duration-150" style={{ width: `${pct}%` }} /></div>
          <p className="hint">{stage} {pct}%</p>
        </div>
      ) : null}
      <FormMessage state={state} />
      <div><button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button></div>
    </form>
  );
}
