import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-cream/15 pb-6">
      <div>
        <h1 className="font-serif text-3xl text-cream md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-cream/70">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, children, href, cta }: { title: string; children?: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="border border-dashed border-cream/25 p-10 text-center">
      <p className="font-serif text-2xl text-cream">{title}</p>
      {children ? <p className="mx-auto mt-2 max-w-md text-sm text-cream/70">{children}</p> : null}
      {href && cta ? <Link href={href} className="btn-primary mt-6">{cta}</Link> : null}
    </div>
  );
}

const tone: Record<string, string> = {
  published: 'border-olive bg-olive/40 text-cream',
  upcoming: 'border-olive bg-olive/40 text-cream',
  draft: 'border-cream/25 text-cream/70',
  past: 'border-tobacco text-cream/70',
  new: 'border-vermouth bg-vermouth/25 text-cream',
  in_review: 'border-copper text-copper',
  replied: 'border-olive bg-olive/40 text-cream',
  archived: 'border-cream/25 text-cream/60',
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn('badge', tone[status])}>{status.replace('_', ' ')}</span>;
}

export function Notice({ tone: t = 'ok', children }: { tone?: 'ok' | 'error'; children: React.ReactNode }) {
  return (
    <p role={t === 'ok' ? 'status' : 'alert'} className={cn('mb-6 border px-4 py-3 text-sm', t === 'ok' ? 'border-olive bg-olive/30 text-cream' : 'border-vermouth bg-vermouth/20 text-cream')}>
      {children}
    </p>
  );
}
