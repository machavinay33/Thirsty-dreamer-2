import { notFound } from 'next/navigation';
import { Notice, PageHeader } from '@/components/admin/ui';
import { PostForm } from '@/components/admin/PostForm';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/lib/types';

export const metadata = { title: 'Edit post' };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireStaff();
  const { id } = await params;
  const { created } = await searchParams;
  const { data } = await (await createClient()).from('posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;
  return (
    <>
      <PageHeader title="Edit post" description={post.title} />
      {created ? <Notice>Post created.</Notice> : null}
      <PostForm post={post} />
    </>
  );
}
