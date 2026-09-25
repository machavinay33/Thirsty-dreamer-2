'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { savePost } from '@/actions/admin/content';
import { POST_CATEGORIES } from '@/lib/content';
import { FormMessage, SelectField, SubmitButton, TextField } from '@/components/ui/fields';
import type { FormState, Post } from '@/lib/types';
import { ImageUploadField } from './ImageUploadField';

const initial: FormState = { ok: false };

export function PostForm({ post }: { post?: Post }) {
  const [state, action] = useActionState(savePost, initial);
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid max-w-3xl gap-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <TextField label="Title" name="title" required defaultValue={post?.title} maxLength={200} error={e.title} />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Slug" name="slug" defaultValue={post?.slug} maxLength={80} hint="Lowercase-with-hyphens. Leave blank to create it from the title." error={e.slug} />
        <div>
          <TextField label="Category" name="category" list="cats" required defaultValue={post?.category} maxLength={60} error={e.category} />
          <datalist id="cats">{POST_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
      </div>
      <TextField label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} maxLength={400} error={e.excerpt} />
      <TextField label="Body (Markdown)" name="body_markdown" required rows={18} defaultValue={post?.body_markdown} hint="Supports headings (##), **bold**, *italic*, lists, links, and images (![alt](url))." error={e.body_markdown} />
      <ImageUploadField label="Cover image" name="cover_image_url" defaultValue={post?.cover_image_url} error={e.cover_image_url} />
      <TextField label="Video URL" name="video_url" type="url" defaultValue={post?.video_url} hint="Direct .mp4/.webm link (e.g. a file uploaded in Admin → Media)." error={e.video_url} />
      <div className="grid gap-6 md:grid-cols-3">
        <TextField label="Author" name="author_name" defaultValue={post?.author_name ?? 'Massimo Zitti'} error={e.author_name} />
        <SelectField label="Status" name="status" defaultValue={post?.status ?? 'draft'} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
        <TextField label="Publish date" name="published_at" type="date" defaultValue={post?.published_at?.slice(0, 10)} hint="Blank = today when published." error={e.published_at} />
      </div>
      <fieldset className="grid gap-6 border border-cream/15 p-5">
        <legend className="px-2 text-sm text-cream">SEO &amp; social</legend>
        <TextField label="SEO title" name="seo_title" defaultValue={post?.seo_title} maxLength={70} error={e.seo_title} />
        <TextField label="SEO description" name="seo_description" rows={2} defaultValue={post?.seo_description} maxLength={200} error={e.seo_description} />
        <ImageUploadField label="Social image" name="social_image_url" defaultValue={post?.social_image_url} hint="1200×630 works best." error={e.social_image_url} />
      </fieldset>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending="Saving…">{post ? 'Save changes' : 'Create post'}</SubmitButton>
        {post ? <Link href={`/admin/posts/${post.id}/preview`} className="btn-ghost">Preview</Link> : null}
        <Link href="/admin/posts" className="btn-ghost">Back to posts</Link>
      </div>
    </form>
  );
}
