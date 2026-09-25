import { EventForm } from '@/components/admin/EventForm';
import { PageHeader } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';

export const metadata = { title: 'New event' };

export default async function NewEvent() {
  await requireStaff();
  return (
    <>
      <PageHeader title="New event" description="Only add real events. Drafts stay private." />
      <EventForm />
    </>
  );
}
