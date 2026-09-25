'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/actions/admin/auth';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/posts', label: 'Journal posts' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/inquiries', label: 'Inquiries' },
  { href: '/admin/settings', label: 'Settings', adminOnly: true },
];

export function AdminNav({ email, role }: { email: string; role: 'admin' | 'editor' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = LINKS.filter((l) => !l.adminOnly || role === 'admin');

  return (
    <aside className="border-b border-cream/15 bg-roast md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center justify-between p-4 md:block md:p-6">
        <Link href="/admin" aria-label="Admin overview"><Image src="/logo-cream.png" alt="Thirsty Dreamer" width={1000} height={666} className="h-12 w-auto" /></Link>
        <button type="button" className="btn-ghost btn-sm md:hidden" aria-expanded={open} aria-controls="admin-links" onClick={() => setOpen((v) => !v)}>{open ? 'Close' : 'Menu'}</button>
      </div>
      <div id="admin-links" className={cn('px-4 pb-6 md:block md:px-6', open ? 'block' : 'hidden')}>
        <nav aria-label="Admin">
          <ul className="grid gap-1">
            {links.map((l) => {
              const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} aria-current={active ? 'page' : undefined} className={cn('block border-l-2 px-3 py-2 text-sm transition-colors duration-200', active ? 'border-copper bg-walnut text-cream' : 'border-transparent text-cream/75 hover:text-cream')}>{l.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6 grid gap-2 border-t border-cream/15 pt-4 text-xs text-cream/65">
          <Link href="/" target="_blank" className="hover:text-copper">View site ↗</Link>
          <p className="break-all">{email} · {role}</p>
          <form action={logout}><button type="submit" className="btn-ghost btn-sm w-full">Sign out</button></form>
        </div>
      </div>
    </aside>
  );
}
