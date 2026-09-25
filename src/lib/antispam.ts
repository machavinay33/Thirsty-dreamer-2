import 'server-only';
import { headers } from 'next/headers';

/**
 * Basic in-memory throttle. On serverless (Vercel) each instance has its own memory, so this only
 * slows casual abuse. For production-grade limiting, swap `throttle()` for Upstash Ratelimit:
 *   import { Ratelimit } from '@upstash/ratelimit'; import { Redis } from '@upstash/redis';
 *   const rl = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '10 m') });
 *   const { success } = await rl.limit(key);
 */
const hits = new Map<string, number[]>();

export function throttle(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/**
 * PLACEHOLDER — Cloudflare Turnstile.
 * 1. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY to your env.
 * 2. Render the Turnstile widget in the forms (it posts a `cf-turnstile-response` field).
 * 3. Verify here: POST https://challenges.cloudflare.com/turnstile/v0/siteverify { secret, response, remoteip }.
 */
export async function verifyCaptcha(_formData: FormData): Promise<boolean> {
  return true;
}
