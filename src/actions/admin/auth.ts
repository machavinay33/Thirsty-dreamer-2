'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clientIp, throttle } from '@/lib/antispam';
import { createClient } from '@/lib/supabase/server';
import type { FormState } from '@/lib/types';

const loginSchema = z.object({ email: z.string().trim().email('Enter a valid email address'), password: z.string().min(1, 'Enter your password') });

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const ip = await clientIp();
  if (!throttle(`login:${ip}`, 10)) return { ok: false, message: 'Too many sign-in attempts. Wait a few minutes and try again.' };

  const parsed = loginSchema.safeParse({ email: fd.get('email'), password: fd.get('password') });
  if (!parsed.success) return { ok: false, message: 'Check the highlighted fields.', errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { ok: false, message: 'Email or password is incorrect.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
    await supabase.auth.signOut();
    return { ok: false, message: 'This account does not have dashboard access. Ask an admin to add you.' };
  }

  const next = String(fd.get('next') ?? '');
  redirect(next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
