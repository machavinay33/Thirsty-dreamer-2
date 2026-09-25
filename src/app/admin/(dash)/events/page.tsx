import Link from 'next/link';
import { deleteEvent } from '@/actions/admin/content';
import { ConfirmForm } from '@/components/admin/ConfirmForm';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { EventRow } from '@/lib/types';

export const metadata = { title: 'Events' };

export default async function EventsAdmin() {
  await requireStaff();
  const { data, error } = await (await createClient()).from('events').select('*').order('event_date', { ascending: false, nullsFirst: true });
  const events = (data ?? []) as EventRow[];
  return (
    <>
      <PageHeader title="Events" description="Pop-ups, takeovers, activations, guest shifts and private experiences." action={<Link href="/admin/events/new" className="btn-primary">New event</Link>} />
      {error ? <p role="alert" className="text-alert">Could not load events: {error.message}</p> : null}
      {!events.length && !error ? (
        <EmptyState title="No events yet" href="/admin/events/new" cta="Add an event">Only add real events — nothing is shown publicly until its status is Upcoming or Past.</EmptyState>
      ) : (
        <ul className="grid gap-3">
          {events.map((e) => (
            <li key={e.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/events/${e.id}`} className="font-serif text-xl text-cream hover:text-copper">{e.title}</Link>
                  <StatusBadge status={e.status} />
                  {e.featured ? <span className="badge border-copper text-copper">featured</span> : null}
                </div>
                <p className="mt-1 text-sm text-cream/65">{[e.event_type, e.venue, e.city, e.event_date ? formatDate(e.event_date) : null].filter(Boolean).join(' · ') || 'No details yet'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/events/${e.id}`} className="btn-ghost btn-sm">Edit</Link>
                <ConfirmForm action={deleteEvent} message={`Delete “${e.title}”?`}>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" className="btn-ghost btn-sm border-vermouth text-alert">Delete</button>
                </ConfirmForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
