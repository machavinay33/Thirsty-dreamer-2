import { JsonLd } from './JsonLd';
import { Cover } from './PostParts';
import { Markdown } from './Markdown';
import type { Post } from '@/lib/types';
import { absoluteUrl, formatDate, mediaUrl, videoMime } from '@/lib/utils';

/** Shared by the public article route and the admin preview. */
export function ArticleView({ post, preview = false }: { post: Post; preview?: boolean }) {
  const video = mediaUrl(post.video_url);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: mediaUrl(post.social_image_url || post.cover_image_url) || absoluteUrl('/og.png'),
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name || 'Massimo Zitti' },
    publisher: { '@type': 'Organization', name: 'Thirsty Dreamer', logo: { '@type': 'ImageObject', url: absoluteUrl('/logo-cream.png') } },
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
  };
  return (
    <article className="section wrap">
      {!preview && <JsonLd data={ld} />}
      {preview && <p className="mb-8 border border-copper bg-copper/10 px-4 py-3 text-sm text-cream">Preview — status: {post.status}. Visitors only see published posts.</p>}
      <header className="max-w-4xl">
        <p className="eyebrow">{post.category}</p>
        <h1 className="display-lg mt-5">{post.title}</h1>
        {post.excerpt ? <p className="lede mt-6 font-serif italic">{post.excerpt}</p> : null}
        <p className="mt-6 text-xs uppercase tracking-label text-cream/60">
          {[post.author_name, formatDate(post.published_at)].filter(Boolean).join(' · ')}
        </p>
      </header>
      {post.cover_image_url ? (
        <div className="mt-12 aspect-[16/9] overflow-hidden border border-cream/15">
          <Cover src={post.cover_image_url} alt={`Cover image for ${post.title}`} />
        </div>
      ) : null}
      <div className="mt-12">
        <Markdown>{post.body_markdown}</Markdown>
      </div>
      {video ? (
        <video className="mt-12 aspect-video w-full max-w-4xl border border-cream/15 bg-roast" controls muted playsInline preload="none" aria-label={`Video: ${post.title}`}>
          <source src={video} type={videoMime(video)} />
        </video>
      ) : null}
    </article>
  );
}
