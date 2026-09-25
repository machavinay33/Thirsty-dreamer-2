import { z } from 'zod';

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max} characters`).optional().transform((v) => (v ? v : null));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Enter a valid date')
  .transform((v) => (v ? v : null));

const email = z
  .string({ required_error: 'Enter your email address' })
  .trim()
  .toLowerCase()
  .min(1, 'Enter your email address')
  .max(254)
  .email('Enter a valid email address, like name@example.com');

const name = z.string({ required_error: 'Enter your name' }).trim().min(2, 'Enter your name').max(120, 'Keep your name under 120 characters');

const consent = (msg: string) => z.string().optional().refine((v) => v === 'on', msg);

export const INQUIRY_TYPE_VALUES = ['speaking', 'brand_collaboration', 'event', 'consultation', 'contact'] as const;

export const inquirySchema = z.object({
  inquiry_type: z.enum(INQUIRY_TYPE_VALUES, { errorMap: () => ({ message: 'Choose what your inquiry is about' }) }),
  name,
  email,
  company: optionalText(160),
  city: optionalText(120),
  budget_range: optionalText(120),
  event_date: optionalDate,
  message: z.string({ required_error: 'Tell Massi a little about your idea' }).trim().min(10, 'Add a few more details (at least 10 characters)').max(4000, 'Keep your message under 4,000 characters'),
  consent: consent('Please agree so Massi can reply to you'),
});

export const waitlistSchema = z.object({
  name,
  email,
  city: z.string({ required_error: 'Enter your city' }).trim().min(2, 'Enter your city').max(120, 'Keep the city under 120 characters'),
  dietary_restrictions: optionalText(500),
  note: optionalText(1000),
  consent: consent('Please agree to be contacted about Secret Diners'),
});

// ---------------- Admin ----------------
const slug = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens');
const url = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a full URL starting with https://')
  .transform((v) => (v ? v : null));

export const postSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(200),
  slug: slug.or(z.literal('')),
  category: z.string().trim().min(1, 'Choose or type a category').max(60),
  excerpt: optionalText(400),
  body_markdown: z.string().trim().min(1, 'Write the post body'),
  cover_image_url: url,
  video_url: url,
  author_name: optionalText(120),
  status: z.enum(['draft', 'published']),
  published_at: optionalDate,
  seo_title: optionalText(70),
  seo_description: optionalText(200),
  social_image_url: url,
});

export const eventSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(200),
  slug: slug.or(z.literal('')),
  event_type: optionalText(80),
  venue: optionalText(160),
  city: optionalText(120),
  event_date: optionalDate,
  description: optionalText(3000),
  image_url: url,
  external_url: url,
  status: z.enum(['draft', 'upcoming', 'past']),
  featured: z.string().optional().transform((v) => v === 'on'),
});

export const mediaMetaSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(200),
  description: optionalText(1000),
  category: z.string().trim().min(1, 'Choose a slot'),
  alt_text: optionalText(300),
  captions: optionalText(20000),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
  featured: z.union([z.boolean(), z.string()]).optional().transform((v) => v === true || v === 'on'),
  status: z.enum(['draft', 'published']),
});

export const formToObject = (fd: FormData) => Object.fromEntries(Array.from(fd.entries()).filter(([, v]) => typeof v === 'string')) as Record<string, string>;
