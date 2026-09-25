'use client';

import { useActionState } from 'react';
import { deleteMedia, updateMedia } from '@/actions/admin/media';
import { CheckField, FormMessage, SelectField, SubmitButton, TextField } from '@/components/ui/fields';
import { MEDIA_SLOTS } from '@/lib/content';
import type { FormState, MediaAsset } from '@/lib/types';
import { ConfirmForm } from './ConfirmForm';
import { StatusBadge } from './ui';

const initial: FormState = { ok: false };

export function MediaItem({ asset, url, posterUrl }: { asset: MediaAsset; url: string; posterUrl: string | null }) {
  const [state, action] = useActionState(updateMedia, initial);
  const e = state.errors ?? {};
  return (
    <li className="card grid gap-4 md:grid-cols-[9rem_1fr]">
      <div className="aspect-[9/16] max-h-56 overflow-hidden border border-cream/15 bg-espresso">
        {asset.media_type === 'video' ? (
          <video src={url} poster={posterUrl ?? undefined} controls muted playsInline preload="none" className="h-full w-full object-cover" aria-label={asset.alt_text || asset.title} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={asset.alt_text || asset.title} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-xl text-cream">{asset.title}</h3>
          <StatusBadge status={asset.status} />
          {asset.featured ? <span className="badge border-copper text-copper">featured</span> : null}
        </div>
        <p className="mt-1 text-xs text-cream/60">{asset.media_type} · sort {asset.sort_order} · {asset.storage_path.split('/').pop()}</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-copper">Edit details</summary>
          <form action={action} className="mt-4 grid gap-4">
            <input type="hidden" name="id" value={asset.id} />
            <SelectField label="Slot" name="category" defaultValue={asset.category} options={MEDIA_SLOTS.map((s) => ({ value: s.key, label: s.label }))} />
            <TextField label="Title" name="title" required defaultValue={asset.title} error={e.title} />
            <TextField label="Description" name="description" rows={2} defaultValue={asset.description} error={e.description} />
            <TextField label="Alt text" name="alt_text" defaultValue={asset.alt_text} error={e.alt_text} />
            <TextField label="Captions / transcript" name="captions" rows={3} defaultValue={asset.captions} error={e.captions} />
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Sort order" name="sort_order" type="number" defaultValue={asset.sort_order} error={e.sort_order} />
              <SelectField label="Status" name="status" defaultValue={asset.status} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
              <div className="self-end pb-3"><CheckField name="featured" label="Featured" defaultChecked={asset.featured} /></div>
            </div>
            <FormMessage state={state} />
            <div><SubmitButton pending="Saving…" className="btn-primary btn-sm">Save</SubmitButton></div>
          </form>
        </details>
        <ConfirmForm action={deleteMedia} message={`Delete “${asset.title}” and its files from storage? This can’t be undone.`} className="mt-4">
          <input type="hidden" name="id" value={asset.id} />
          <button type="submit" className="btn-ghost btn-sm border-vermouth text-alert">Delete</button>
        </ConfirmForm>
      </div>
    </li>
  );
}
