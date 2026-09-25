# Thirsty Dreamer

Personal brand website for Toronto bartender **Massimo "Massi" Zitti** — Next.js (App Router) + TypeScript + Tailwind, backed by Supabase (Postgres, Auth, Storage, RLS), deployed on Vercel.

## Stack

- Next.js 15 (App Router, Server Actions), React 19, TypeScript
- Tailwind CSS (design tokens as CSS variables in `src/app/globals.css`)
- Supabase: Postgres + Row Level Security, Auth (email/password), Storage (public `media` bucket)
- Zod validation on every form/server action
- Optional: Resend for email notifications on new inquiries/waitlist joins

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values from step 2
npm run dev
```

The site renders even with no Supabase configured (forms/content just show empty states), so you can check the design before wiring up the backend. Nothing under `/admin` works until Supabase is connected.

## 2. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste the entire contents of `supabase/migrations/0001_init.sql` → Run.
   This creates all tables (`profiles`, `posts`, `events`, `media_assets`, `inquiries`, `secret_diner_waitlist`), RLS policies, the public `media` storage bucket, and seeds the 4 placeholder journal posts.
3. **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (optional, server-only) → `SUPABASE_SERVICE_ROLE_KEY` — only needed if you want to create staff accounts from **Admin → Settings** instead of the Supabase dashboard.
4. **Authentication → URL Configuration**:
   - Site URL → your deployed URL (or `http://localhost:3000` while developing).
   - Add the same URL(s) under Redirect URLs.
5. **Authentication → Providers** → confirm Email is enabled. This project only uses email/password (no magic links, no OAuth) via server-side `signInWithPassword`.

### Create the first admin

1. **Authentication → Users → Add user** — enter an email + password, and check "Auto Confirm User".
2. **SQL Editor**, run (swap in the real email):
   ```sql
   insert into public.profiles (id, full_name, role)
   select id, 'Massimo Zitti', 'admin' from auth.users where email = 'you@example.com'
   on conflict (id) do update set role = 'admin';
   ```
3. Sign in at `/admin/login`. From **Admin → Settings** you can invite further staff (needs `SUPABASE_SERVICE_ROLE_KEY`), or repeat the two steps above for each new admin.

## 3. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add the environment variables from `.env.example` under **Project Settings → Environment Variables** — set them for **Production, Preview, and Development**:
   - `NEXT_PUBLIC_SITE_URL` — set this to the real deployed domain after your first deploy (used for canonical URLs, sitemap, OG tags, JSON-LD).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required.
   - `SUPABASE_SERVICE_ROLE_KEY` — optional, server-only, never expose client-side.
   - `RESEND_API_KEY` + `NOTIFY_TO_EMAIL` (+ optional `NOTIFY_FROM_EMAIL`) — optional; email notifications for new inquiries/waitlist signups only fire when both required vars are set.
3. Deploy. Go back into Supabase Auth URL Configuration and make sure the production URL is registered (step 2.4 above).

## 4. Managing content

Everything editorial lives in the database and is edited from `/admin` (sign in required):

- **Posts** — the journal. Draft vs. published controls public visibility. Body is Markdown.
- **Events** — upcoming/past split automatically by date.
- **Media** — upload video/image files for the 6 homepage gallery slots (behind-the-bar, cocktail-craft, fermentation, hospitality-events, personal-story, brand-collaboration) plus the hero and about slots. Uploads go straight to Supabase Storage from the browser; nothing large ever touches this repo or git.
- **Inquiries** — contact/consultation form submissions and the Secret Diners waitlist, with CSV export.
- **Settings** (admin role only) — manage staff roles, revoke access, create new staff accounts.

### Video guidance

Keep files under the 50MB bucket limit set in the migration:
- Compress to H.264 (video) / AAC (audio), `.mp4`, with `faststart` enabled.
- Portrait framing, ~720px wide is plenty for the gallery cards.
- Provide a poster/thumbnail image alongside each video in the uploader.
- Add a short transcript/caption where possible — the video cards include a collapsible transcript for accessibility.

## 5. Content & assumptions made during the build

Per the brief, no content is invented beyond what's specified. Two spots were left as clearly-labeled placeholders because the source brief didn't give exact values — confirm and replace them before launch:

- **Speaking engagement details** (`src/lib/content.ts` → `SPEAKING`): exact workshop durations and group sizes weren't specified, so those meta lines currently read "Duration & group size on request." Update with real numbers, or leave as-is if that's the intended approach.
- **Mother Cocktail Bar link** (`src/lib/content.ts` → `MOTHER_URL`): marked as a placeholder search URL — replace with the real site/social link once available.
- The Brand Collaboration example card on the homepage is explicitly labeled as a fictional example (per the brief) — it is not a real testimonial or client.

No newsletter/"pour me in" feature exists anywhere, and no fake testimonials, awards, or events were added — only the 4 seed journal posts and structural placeholders the brief called for.

## 6. QA checklist before launch

- [ ] `npm run build` completes with no type errors (run this locally/in CI — it could not be executed in the sandbox this project was built in, since that environment has no network access to the npm registry).
- [ ] Visit every public route; confirm draft posts/past-dated events don't leak into public queries (RLS + the fetchers in `src/lib/data.ts` both filter, but verify).
- [ ] Confirm `/admin/*` redirects to `/admin/login` when signed out (middleware + per-page `requireStaff()`).
- [ ] Confirm an `editor` role cannot open `/admin/settings` (redirects to `/admin?denied=1`).
- [ ] Submit the contact, consultation, and waitlist forms; confirm rows land in Supabase and (if configured) an email notification arrives.
- [ ] As a signed-out user, confirm you cannot `select` from `inquiries` or `secret_diner_waitlist` via the Supabase client (RLS should block it — insert-only).
- [ ] Upload/replace/delete a media asset in each of the 6 gallery slots; confirm the storage file is removed on delete.
- [ ] Check mobile widths (375px), keyboard-only navigation, and `prefers-reduced-motion` (autoplay/animations should stand down).
- [ ] Confirm no `.mp4/.webm/.mov` files are ever committed to git (already enforced by `.gitignore`).

## Project structure

```
src/
  app/            routes: (site) public group, admin/(dash) protected group
  actions/        server actions (public.ts = contact/waitlist; admin/* = CMS + auth)
  components/     public/ (site UI) + admin/ (dashboard UI) + ui/ (shared form fields)
  lib/            supabase clients, env, types, zod schemas, data fetchers, utils
supabase/migrations/0001_init.sql   full schema + RLS + storage policies + seed posts
middleware.ts                       edge-level /admin/* auth guard
```
