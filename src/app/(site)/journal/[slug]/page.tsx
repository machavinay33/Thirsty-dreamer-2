import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/public/ArticleView';
import { getPostBySlug } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { mediaUrl } from '@/lib/utils';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Entry not found', robots: { index: false } };
  const meta = buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || 'A journal entry from Thirsty Dreamer.',
    path: `/journal/${post.slug}`,
    image: mediaUrl(post.social_image_url || post.cover_image_url),
  });
  return { ...meta, openGraph: { ...meta.openGraph, type: 'article', publishedTime: post.published_at ?? undefined, authors: post.author_name ? [post.author_name] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <ArticleView post={post} />
      <div className="wrap pb-24">
        <Link href="/journal" className="link-arrow"><span aria-hidden="true">←</span> Back to the journal</Link>
      </div>
    </>
  );
}
