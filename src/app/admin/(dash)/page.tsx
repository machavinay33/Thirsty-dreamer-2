import Link from 'next/link';
import { Notice, PageHeader } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Overview' };

export default async function Overview({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const staff = await requireStaff();
  const { denied } = await searchParams;
  const sb = await createClient();
  const head = { count: 'exact' as const, head: true };
  const [pub, draft, ev, media, mediaPub, inq, wait] = await Promise.all([
    sb.from('posts').select('id', head).eq('status', 'published'),
    sb.from('posts').select('id', head).eq('status', 'draft'),
    sb.from('events').select('id', head),
    sb.from('media_assets').select('id', head),
    sb.from('media_assets').select('id', head).eq('status', 'published'),
    sb.from('inquiries').select('id', head).eq('status', 'new'),
    sb.from('secret_diner_waitlist').select('id', head),
  ]);
  const cards = [
    { label: 'Published posts', value: pub.count, href: '/admin/posts' },
    { label: 'Draft posts', value: draft.count, href: '/admin/posts' },
    { label: 'Events', value: ev.count, href: '/admin/events' },
    { label: 'Media (published / total)', value: `${mediaPub.count ?? 0} / ${media.count ?? 0}`, href: '/admin/media' },
    { label: 'New inquiries', value: inq.count, href: '/admin/inquiries' },
    { label: 'Secret Diners waitlist', value: wait.count, href: '/admin/inquiries?tab=waitlist' },
  ];
  return (
    <>
      <PageHeader title={`Welcome${staff.fullName ? `, ${staff.fullName.split(' ')[0]}` : ''}`} description="A quick look at what’s live and what needs attention." />
      {denied ? <Notice tone="error">That area is for admins only.</Notice> : null}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="card block transition-colors duration-200 hover:border-copper">
              <p className="text-xs uppercase tracking-label text-cream/60">{c.label}</p>
              <p className="mt-2 font-serif text-5xl text-cream">{c.value ?? 0}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
