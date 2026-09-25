'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import type { FormState } from '@/lib/types';

export async function changeRole(fd: FormData): Promise<void> {
  const me = await requireAdmin();
  const id = String(fd.get('id') ?? '');
  const role = String(fd.get('role') ?? '');
  if (!id || id === me.id || (role !== 'admin' && role !== 'editor')) return; // never let an admin demote themselves
  await (await createClient()).from('profiles').update({ role }).eq('id', id);
  revalidatePath('/admin/settings');
}

export async function revokeAccess(fd: FormData): Promise<void> {
  const me = await requireAdmin();
  const id = String(fd.get('id') ?? '');
  if (!id || id === me.id) return;
  await (await createClient()).from('profiles').delete().eq('id', id);
  revalidatePath('/admin/settings');
}

const staffSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(10, 'Use at least 10 characters'),
  full_name: z.string().trim().max(120).optional(),
  role: z.enum(['admin', 'editor']),
});

/** Creates a confirmed Auth user + profile. Needs SUPABASE_SERVICE_ROLE_KEY (server-only). */
export async function createStaff(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const svc = createServiceClient();
  if (!svc) return { ok: false, message: 'SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel, or create the user in the Supabase dashboard instead (see README).' };

  const parsed = staffSchema.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: parsed.error.flatten().fieldErrors };

  const { email, password, full_name, role } = parsed.data;
  const { data, error } = await svc.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) return { ok: false, message: error?.message ?? 'Could not create user.' };
  const { error: pErr } = await svc.from('profiles').insert({ id: data.user.id, full_name: full_name || null, role });
  if (pErr) return { ok: false, message: `User created but the profile failed: ${pErr.message}` };
  revalidatePath('/admin/settings');
  return { ok: true, message: `Created ${email} as ${role}.` };
}
