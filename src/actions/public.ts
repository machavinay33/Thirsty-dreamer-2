'use server';

import { createPublicClient } from '@/lib/supabase/public';
import { hasSupabase } from '@/lib/env';
import { clientIp, throttle, verifyCaptcha } from '@/lib/antispam';
import { notifyByEmail } from '@/lib/notify';
import { formToObject, inquirySchema, waitlistSchema } from '@/lib/validation';
import type { FormState } from '@/lib/types';

const THROTTLED: FormState = { ok: false, message: 'Too many requests from your connection. Please wait a few minutes and try again.' };
const FAILED: FormState = { ok: false, message: 'Something went wrong on our side and your message was not saved. Please try again in a moment.' };

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: pretend success so bots learn nothing.
  if (String(formData.get('website') ?? '').trim() !== '') return { ok: true, message: 'Thank you — your message is in.' };

  const ip = await clientIp();
  if (!throttle(`inquiry:${ip}`, 5)) return THROTTLED;
  if (!(await verifyCaptcha(formData))) return { ok: false, message: 'Verification failed. Please try again.' };

  const parsed = inquirySchema.safeParse(formToObject(formData));
  if (!parsed.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: parsed.error.flatten().fieldErrors };
  if (!hasSupabase) return FAILED;

  const { consent: _consent, ...row } = parsed.data;
  const { error } = await createPublicClient().from('inquiries').insert({ ...row, status: 'new' });
  if (error) {
    console.error('inquiry insert failed', error.message);
    return FAILED;
  }
  await notifyByEmail(`New ${row.inquiry_type} inquiry from ${row.name}`, `${row.name} <${row.email}>\n${row.company ?? ''}\n\n${row.message}`);
  return { ok: true, message: 'Thank you — your message is in. Massi will reply to you personally.' };
}

export async function joinWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get('website') ?? '').trim() !== '') return { ok: true, message: 'You’re on the list.' };

  const ip = await clientIp();
  if (!throttle(`waitlist:${ip}`, 4)) return THROTTLED;
  if (!(await verifyCaptcha(formData))) return { ok: false, message: 'Verification failed. Please try again.' };

  const parsed = waitlistSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { ok: false, message: 'Please fix the highlighted fields.', errors: parsed.error.flatten().fieldErrors };
  if (!hasSupabase) return FAILED;

  const { consent, ...rest } = parsed.data;
  const { error } = await createPublicClient().from('secret_diner_waitlist').insert({ ...rest, consent: Boolean(consent) });
  if (error) {
    console.error('waitlist insert failed', error.message);
    return FAILED;
  }
  await notifyByEmail(`Secret Diners waitlist: ${rest.name}`, `${rest.name} <${rest.email}> — ${rest.city}`);
  return { ok: true, message: 'You’re on the waitlist. Joining doesn’t reserve a seat — if a table opens, you’ll hear from us.' };
}
