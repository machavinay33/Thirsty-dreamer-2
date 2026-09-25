import { getStaff } from '@/lib/auth';
import { toCsv } from '@/lib/csv';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const COLUMNS = {
  inquiries: ['created_at', 'inquiry_type', 'status', 'name', 'email', 'company', 'city', 'budget_range', 'event_date', 'message'],
  waitlist: ['created_at', 'name', 'email', 'city', 'dietary_restrictions', 'note', 'consent'],
} as const;

export async function GET(request: Request) {
  const staff = await getStaff();
  if (!staff) return new Response('Unauthorized', { status: 401 });

  const which = new URL(request.url).searchParams.get('table') === 'waitlist' ? 'waitlist' : 'inquiries';
  const table = which === 'waitlist' ? 'secret_diner_waitlist' : 'inquiries';
  const { data, error } = await (await createClient()).from(table).select('*').order('created_at', { ascending: false });
  if (error) return new Response(`Export failed: ${error.message}`, { status: 500 });

  const csv = toCsv((data ?? []) as Record<string, unknown>[], [...COLUMNS[which]]);
  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="thirsty-dreamer-${which}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
