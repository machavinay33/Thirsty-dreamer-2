import Link from 'next/link';
import { deletePost } from '@/actions/admin/content';
import { ConfirmForm } from '@/components/admin/ConfirmForm';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/ui';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

export const metadata = { title: 'Journal posts' };

export default async function PostsAdmin() {
  await requireStaff();
  const { data, error } = await (await createClient()).from('posts').select('id,title,slug,category,status,published_at,updated_at').order('created_at', { ascending: false });
  const posts = (data ?? []) as Pick<Post, 'id' | 'title' | 'slug' | 'category' | 'status' | 'published_at' | 'updated_at'>[];
  return (
    <>
      <PageHeader title="Journal posts" description="Write, publish and preview journal entries." action={<Link href="/admin/posts/new" className="btn-primary">New post</Link>} />
      {error ? <p role="alert" className="text-alert">Could not load posts: {error.message}</p> : null}
      {!posts.length && !error ? (
        <EmptyState title="No posts yet" href="/admin/posts/new" cta="Write the first entry">Drafts stay private until you publish them.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-label text-cream/60">
              <tr><th className="py-3 pr-4 font-medium">Title</th><th className="pr-4 font-medium">Category</th><th className="pr-4 font-medium">Status</th><th className="pr-4 font-medium">Date</th><th className="font-medium"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-cream/10 align-middle">
                  <td className="py-4 pr-4"><Link href={`/admin/posts/${p.id}`} className="font-serif text-lg text-cream hover:text-copper">{p.title}</Link><p className="text-xs text-cream/50">/{p.slug}</p></td>
                  <td className="pr-4">{p.category}</td>
                  <td className="pr-4"><StatusBadge status={p.status} /></td>
                  <td className="pr-4 text-cream/70">{formatDate(p.published_at ?? p.updated_at, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link href={`/admin/posts/${p.id}`} className="btn-ghost btn-sm">Edit</Link>
                      <Link href={`/admin/posts/${p.id}/preview`} className="btn-ghost btn-sm">Preview</Link>
                      <ConfirmForm action={deletePost} message={`Delete “${p.title}”? This can’t be undone.`}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="btn-ghost btn-sm border-vermouth text-alert">Delete</button>
                      </ConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
