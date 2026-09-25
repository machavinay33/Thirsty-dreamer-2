export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  body_markdown: string;
  cover_image_url: string | null;
  video_url: string | null;
  author_name: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  social_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_type: string | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  status: 'draft' | 'upcoming' | 'past';
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaAsset = {
  id: string;
  title: string;
  description: string | null;
  media_type: 'video' | 'image';
  storage_path: string;
  poster_path: string | null;
  category: string;
  alt_text: string | null;
  captions: string | null;
  sort_order: number;
  featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  inquiry_type: string;
  name: string;
  email: string;
  company: string | null;
  city: string | null;
  budget_range: string | null;
  event_date: string | null;
  message: string;
  status: 'new' | 'in_review' | 'replied' | 'archived';
  created_at: string;
};

export type WaitlistRow = {
  id: string;
  name: string;
  email: string;
  city: string;
  dietary_restrictions: string | null;
  note: string | null;
  consent: boolean;
  created_at: string;
};

export type Profile = { id: string; full_name: string | null; role: 'admin' | 'editor'; created_at: string };
