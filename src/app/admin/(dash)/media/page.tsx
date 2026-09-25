import { EmptyState, PageHeader } from '@/components/admin/ui';
import { MediaItem } from '@/components/admin/MediaItem';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { requireStaff } from '@/lib/auth';
import { MEDIA_SLOTS } from '@/lib/content';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/utils';
import type { MediaAsset } from '@/lib/types';

export const metadata = { title: 'Media' };

export default async function MediaAdmin() {
  await requireStaff();
  const { data, error } = await (await createClient())
    .from('media_assets').select('*')
    .order('featured', { ascending: false }).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  const assets = (data ?? []) as MediaAsset[];

  return (
    <>
      <PageHeader title="Media" description="Upload videos and images to the hero, About section and the six Behind the Dream slots. Files go straight to Supabase Storage." />
      {error ? <p role="alert" className="mb-6 text-alert">Could not load media: {error.message}</p> : null}
      <div className="grid gap-10 xl:grid-cols-[minmax(0,32rem)_1fr]">
        <MediaUploader />
        <div className="grid content-start gap-10">
          {MEDIA_SLOTS.map((slot) => {
            const items = assets.filter((a) => a.category === slot.key);
            const live = items.find((a) => a.status === 'published');
            return (
              <section key={slot.key} aria-labelledby={`slot-${slot.key}`}>
                <h2 id={`slot-${slot.key}`} className="font-serif text-2xl text-cream">{slot.label}</h2>
                <p className="mb-4 mt-1 text-xs text-cream/60">{live ? `Live now: ${live.title}` : 'Nothing published — visitors see the “coming soon” placeholder.'}</p>
                {items.length ? (
                  <ul className="grid gap-4">
                    {items.map((a) => <MediaItem key={a.id} asset={a} url={mediaUrl(a.storage_path) ?? ''} posterUrl={mediaUrl(a.poster_path)} />)}
                  </ul>
                ) : (
                  <EmptyState title="Empty slot">Upload a file with this slot selected.</EmptyState>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
