import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/public/ArticleView';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/lib/types';

export const metadata = { title: 'Preview post' };

export default async function PreviewPost({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const { data } = await (await createClient()).from('posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="-mx-5 -my-5 md:-mx-10 md:-my-10">
      <div className="wrap pt-6"><Link href={`/admin/posts/${id}`} className="link-arrow"><span aria-hidden="true">←</span> Back to editor</Link></div>
      <ArticleView post={data as Post} preview />
    </div>
  );
}
