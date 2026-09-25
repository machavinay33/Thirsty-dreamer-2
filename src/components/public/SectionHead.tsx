import { cn } from '@/lib/utils';

/** Section label with a thin rule and (optional) index number for sections that form a sequence on the page. */
export function SectionLabel({ children, index, className }: { children: React.ReactNode; index?: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {index ? <span className="font-serif text-sm italic text-cream/60">{index}</span> : null}
      <span className="h-px w-10 bg-copper/60" aria-hidden="true" />
      <p className="eyebrow">{children}</p>
    </div>
  );
}
