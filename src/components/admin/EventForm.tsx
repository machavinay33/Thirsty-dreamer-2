'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { saveEvent } from '@/actions/admin/content';
import { CheckField, FormMessage, SelectField, SubmitButton, TextField } from '@/components/ui/fields';
import { EVENTS } from '@/lib/content';
import type { EventRow, FormState } from '@/lib/types';
import { ImageUploadField } from './ImageUploadField';

const initial: FormState = { ok: false };

export function EventForm({ event }: { event?: EventRow }) {
  const [state, action] = useActionState(saveEvent, initial);
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid max-w-3xl gap-6">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <TextField label="Title" name="title" required defaultValue={event?.title} maxLength={200} error={e.title} />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Slug" name="slug" defaultValue={event?.slug} maxLength={80} hint="Leave blank to create it from the title." error={e.slug} />
        <div>
          <TextField label="Event type" name="event_type" list="types" defaultValue={event?.event_type} maxLength={80} error={e.event_type} />
          <datalist id="types">{EVENTS.types.map((t) => <option key={t} value={t} />)}</datalist>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <TextField label="Venue" name="venue" defaultValue={event?.venue} error={e.venue} />
        <TextField label="City" name="city" defaultValue={event?.city} error={e.city} />
        <TextField label="Date" name="event_date" type="date" defaultValue={event?.event_date} error={e.event_date} />
      </div>
      <TextField label="Description" name="description" rows={5} defaultValue={event?.description} maxLength={3000} error={e.description} />
      <ImageUploadField label="Cover image" name="image_url" defaultValue={event?.image_url} error={e.image_url} />
      <TextField label="External URL" name="external_url" type="url" defaultValue={event?.external_url} placeholder="https://…" error={e.external_url} />
      <div className="grid gap-6 md:grid-cols-2">
        <SelectField label="Status" name="status" defaultValue={event?.status ?? 'draft'} options={[{ value: 'draft', label: 'Draft (private)' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
        <div className="self-end pb-3"><CheckField name="featured" label="Featured" defaultChecked={event?.featured} /></div>
      </div>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending="Saving…">{event ? 'Save changes' : 'Create event'}</SubmitButton>
        <Link href="/admin/events" className="btn-ghost">Back to events</Link>
      </div>
    </form>
  );
}
