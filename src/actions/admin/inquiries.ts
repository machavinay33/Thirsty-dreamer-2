'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin, requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const STATUSES = ['new', 'in_review', 'replied', 'archived'];

export async function updateInquiryStatus(fd: FormData): Promise<void> {
  await requireStaff();
  const id = String(fd.get('id') ?? '');
  const status = String(fd.get('status') ?? '');
  if (!id || !STATUSES.includes(status)) return;
  await (await createClient()).from('inquiries').update({ status }).eq('id', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

/** Admin-only (also enforced by RLS). */
export async function deleteRecord(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = String(fd.get('id') ?? '');
  const table = String(fd.get('table') ?? '');
  if (!id || (table !== 'inquiries' && table !== 'secret_diner_waitlist')) return;
  await (await createClient()).from(table).delete().eq('id', id);
  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}
