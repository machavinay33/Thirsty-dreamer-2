'use client';

import { useState } from 'react';
import { mediaUrl } from '@/lib/utils';
import { uploadToStorage, validateFile } from '@/lib/upload-client';

/** URL field + "upload image" button. Uploads to Supabase Storage (with progress) and fills the field with the public URL. */
export function ImageUploadField({ label, name, defaultValue, error, hint }: { label: string; name: string; defaultValue?: string | null; error?: string[]; hint?: string }) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [progress, setProgress] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const id = `f-${name}`;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const bad = validateFile(file, 'image');
    if (bad) return setProblem(bad);
    setProblem(null);
    setProgress(0);
    try {
      const path = await uploadToStorage(file, 'images', setProgress);
      setValue(mediaUrl(path) ?? '');
    } catch (err) {
      setProblem((err as Error).message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="label">{label} <span className="ml-1 text-xs font-normal text-cream/50">(optional)</span></label>
      <div className="flex gap-2">
        <input id={id} name={name} type="url" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://… or upload" className="input" aria-invalid={error?.length ? true : undefined} />
        <label className="btn-ghost btn-sm !min-h-[3rem] cursor-pointer whitespace-nowrap focus-within:outline focus-within:outline-2 focus-within:outline-copper">
          Upload
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="sr-only" onChange={onFile} />
        </label>
      </div>
      {progress !== null ? (
        <div className="mt-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="h-1.5 bg-cream/15"><div className="h-full bg-copper transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
          <span className="hint">Uploading… {progress}%</span>
        </div>
      ) : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="mt-3 h-24 w-auto border border-cream/15 object-cover" />
      ) : null}
      {hint ? <span className="hint">{hint}</span> : null}
      {problem ? <span className="error-text" role="alert">{problem}</span> : null}
      {error?.length ? <span className="error-text" role="alert">{error[0]}</span> : null}
    </div>
  );
}
