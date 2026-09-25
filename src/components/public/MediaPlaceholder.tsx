import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Designed stand-in shown until real media is uploaded from Admin → Media. */
export function MediaPlaceholder({ label, className, note = 'Upload in Admin → Media' }: { label: string; className?: string; note?: string }) {
  return (
    <div className={cn('relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border border-cream/10 bg-gradient-to-br from-walnut via-roast to-espresso p-6 text-center', className)}>
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: 'radial-gradient(60% 50% at 30% 20%, rgb(var(--copper) / 0.18), transparent 70%)' }} />
      <Image src="/logo-cream.png" alt="" width={1000} height={666} className="relative w-2/3 max-w-[280px] opacity-20" />
      <div className="relative">
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-xs text-cream/60">{note}</p>
      </div>
    </div>
  );
}
