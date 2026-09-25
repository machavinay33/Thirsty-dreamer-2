import { notFound } from 'next/navigation';
import { EventForm } from '@/components/admin/EventForm';
import { Notice, PageHeader } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/lib/types';

export const metadata = { title: 'Edit event' };

export default async function EditEvent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireStaff();
  const { id } = await params;
  const { created } = await searchParams;
  const { data } = await (await createClient()).from('events').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const event = data as EventRow;
  return (
    <>
      <PageHeader title="Edit event" description={event.title} />
      {created ? <Notice>Event created.</Notice> : null}
      <EventForm event={event} />
    </>
  );
}
