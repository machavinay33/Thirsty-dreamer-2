import Link from 'next/link';
import { deleteRecord, updateInquiryStatus } from '@/actions/admin/inquiries';
import { ConfirmForm } from '@/components/admin/ConfirmForm';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';
import { INQUIRY_TYPES } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { cn, formatDate } from '@/lib/utils';
import type { Inquiry, WaitlistRow } from '@/lib/types';

export const metadata = { title: 'Inquiries' };
const STATUSES = ['new', 'in_review', 'replied', 'archived'] as const;

export default async function InquiriesAdmin({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string }> }) {
  const staff = await requireStaff();
  const { tab, status } = await searchParams;
  const isWait = tab === 'waitlist';
  const sb = await createClient();
  const stamp = (d: string) => formatDate(d, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } as Intl.DateTimeFormatOptions);
  const tabCls = (on: boolean) => cn('border-b-2 px-1 pb-2 text-sm', on ? 'border-copper text-cream' : 'border-transparent text-cream/60 hover:text-cream');

  let inquiries: Inquiry[] = [];
  let waitlist: WaitlistRow[] = [];
  let error: string | null = null;
  if (isWait) {
    const r = await sb.from('secret_diner_waitlist').select('*').order('created_at', { ascending: false }).limit(1000);
    waitlist = (r.data ?? []) as WaitlistRow[]; error = r.error?.message ?? null;
  } else {
    let q = sb.from('inquiries').select('*').order('created_at', { ascending: false }).limit(1000);
    if (status && (STATUSES as readonly string[]).includes(status)) q = q.eq('status', status);
    const r = await q;
    inquiries = (r.data ?? []) as Inquiry[]; error = r.error?.message ?? null;
  }

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="Submissions saved from the website forms. Only staff can see these."
        action={<a href={`/admin/inquiries/export?table=${isWait ? 'waitlist' : 'inquiries'}`} className="btn-ghost">Export CSV</a>}
      />
      <nav aria-label="Inquiry tabs" className="mb-6 flex gap-6 border-b border-cream/15">
        <Link href="/admin/inquiries" className={tabCls(!isWait)} aria-current={!isWait ? 'page' : undefined}>Inquiries</Link>
        <Link href="/admin/inquiries?tab=waitlist" className={tabCls(isWait)} aria-current={isWait ? 'page' : undefined}>Secret Diners waitlist</Link>
      </nav>
      {!isWait && (
        <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2 text-xs">
          <Link href="/admin/inquiries" className={cn('badge', !status && 'border-copper text-copper')}>all</Link>
          {STATUSES.map((s) => <Link key={s} href={`/admin/inquiries?status=${s}`} className={cn('badge', status === s && 'border-copper text-copper')}>{s.replace('_', ' ')}</Link>)}
        </nav>
      )}
      {error ? <p role="alert" className="text-alert">Could not load records: {error}</p> : null}

      {isWait ? (
        waitlist.length ? (
          <ul className="grid gap-3">
            {waitlist.map((w) => (
              <li key={w.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl text-cream">{w.name}</p>
                    <p className="text-sm text-cream/70"><a href={`mailto:${w.email}`} className="hover:text-copper">{w.email}</a> · {w.city}</p>
                  </div>
                  <p className="text-xs text-cream/55">{stamp(w.created_at)}</p>
                </div>
                {w.dietary_restrictions ? <p className="mt-3 text-sm"><span className="text-cream/60">Dietary: </span>{w.dietary_restrictions}</p> : null}
                {w.note ? <p className="mt-1 whitespace-pre-line text-sm"><span className="text-cream/60">Note: </span>{w.note}</p> : null}
                {staff.role === 'admin' && (
                  <ConfirmForm action={deleteRecord} message="Delete this waitlist entry?" className="mt-3">
                    <input type="hidden" name="id" value={w.id} /><input type="hidden" name="table" value="secret_diner_waitlist" />
                    <button type="submit" className="btn-ghost btn-sm border-vermouth text-alert">Delete</button>
                  </ConfirmForm>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !error && <EmptyState title="No waitlist entries yet">People who join the Secret Diners waitlist will appear here.</EmptyState>
        )
      ) : inquiries.length ? (
        <ul className="grid gap-3">
          {inquiries.map((i) => (
            <li key={i.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl text-cream">{i.name} <span className="ml-2 align-middle"><StatusBadge status={i.status} /></span></p>
                  <p className="text-sm text-cream/70"><a href={`mailto:${i.email}`} className="hover:text-copper">{i.email}</a>{i.company ? ` · ${i.company}` : ''}{i.city ? ` · ${i.city}` : ''}</p>
                  <p className="mt-1 text-xs uppercase tracking-label text-copper">{INQUIRY_TYPES.find((t) => t.value === i.inquiry_type)?.label ?? i.inquiry_type}{i.budget_range ? ` · Budget: ${i.budget_range}` : ''}{i.event_date ? ` · Date: ${formatDate(i.event_date)}` : ''}</p>
                </div>
                <p className="text-xs text-cream/55">{stamp(i.created_at)}</p>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-cream/85">{i.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <form action={updateInquiryStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={i.id} />
                  <label htmlFor={`st-${i.id}`} className="sr-only">Status</label>
                  <select id={`st-${i.id}`} name="status" defaultValue={i.status} className="input !w-auto !py-1.5 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <button type="submit" className="btn-ghost btn-sm">Update</button>
                </form>
                {staff.role === 'admin' && (
                  <ConfirmForm action={deleteRecord} message="Delete this inquiry?">
                    <input type="hidden" name="id" value={i.id} /><input type="hidden" name="table" value="inquiries" />
                    <button type="submit" className="btn-ghost btn-sm border-vermouth text-alert">Delete</button>
                  </ConfirmForm>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && <EmptyState title="No inquiries yet">{status ? 'Nothing matches this filter.' : 'Messages from the website forms will appear here.'}</EmptyState>
      )}
    </>
  );
}
