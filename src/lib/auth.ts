import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type Staff = { id: string; email: string; role: 'admin' | 'editor'; fullName: string | null };

/** Returns the signed-in staff member (verified against Supabase Auth AND the profiles table) or null. */
export const getStaff = cache(async (): Promise<Staff | null> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle();
    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) return null;
    return { id: user.id, email: user.email ?? '', role: profile.role, fullName: profile.full_name };
  } catch {
    return null;
  }
});

export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect('/admin/login');
  return staff;
}

export async function requireAdmin(): Promise<Staff> {
  const staff = await requireStaff();
  if (staff.role !== 'admin') redirect('/admin?denied=1');
  return staff;
}
