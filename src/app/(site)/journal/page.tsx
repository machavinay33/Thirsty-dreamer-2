import type { Metadata } from 'next';
import Link from 'next/link';
import { PostRow } from '@/components/public/PostParts';
import { Reveal } from '@/components/public/Reveal';
import { SectionLabel } from '@/components/public/SectionHead';
import { JOURNAL } from '@/lib/content';
import { getPostCategories, getPosts } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: 'Journal',
  description: 'Notes from behind the bar — recipes, ferments, half-formed ideas, and the honest business of building something worth raising a glass to.',
  path: '/journal',
});

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [categories, posts] = await Promise.all([getPostCategories(), getPosts({ category })]);
  const pill = (active: boolean) => cn('border px-4 py-2 text-sm transition-colors duration-200', active ? 'border-copper bg-copper/15 text-cream' : 'border-cream/25 text-cream/75 hover:border-copper hover:text-cream');

  return (
    <div className="section wrap">
      <Reveal>
        <SectionLabel>{JOURNAL.label}</SectionLabel>
        <h1 className="display-lg mt-6 max-w-5xl">The Journal</h1>
        <p className="lede mt-6">{JOURNAL.copy}</p>
      </Reveal>

      <nav aria-label="Filter journal by category" className="mt-12">
        <ul className="flex flex-wrap gap-2">
          <li><Link href="/journal" className={pill(!category)} aria-current={!category ? 'page' : undefined}>All</Link></li>
          {categories.map((c) => (
            <li key={c}>
              <Link href={`/journal?category=${encodeURIComponent(c)}`} className={pill(category === c)} aria-current={category === c ? 'page' : undefined}>{c}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12" aria-live="polite">
        {posts.length ? (
          <>
            {posts.map((p) => <PostRow key={p.id} post={p} withImage />)}
            <div className="border-t border-cream/15" />
          </>
        ) : (
          <p className="border border-dashed border-cream/25 p-8 text-cream/70">{category ? `No entries in “${category}” yet.` : 'New entries are on the way.'}</p>
        )}
      </div>
    </div>
  );
}
