'use client';

import { useActionState, useState } from 'react';
import { submitInquiry } from '@/actions/public';
import { INQUIRY_TYPES } from '@/lib/content';
import { CheckField, FormMessage, Honeypot, SelectField, SubmitButton, TextField } from '@/components/ui/fields';
import type { FormState } from '@/lib/types';

const initial: FormState = { ok: false };
type InquiryType = (typeof INQUIRY_TYPES)[number]['value'];

/** Reusable validated inquiry form. Pass `lockType` to fix the inquiry type (e.g. the consultation page). */
export function InquiryForm({ defaultType = 'contact', lockType = false, submitLabel = 'Send message' }: { defaultType?: InquiryType; lockType?: boolean; submitLabel?: string }) {
  const [state, action] = useActionState(submitInquiry, initial);
  const [type, setType] = useState<string>(defaultType);
  const e = state.errors ?? {};
  const showBudget = type === 'brand_collaboration' || type === 'event' || type === 'consultation';
  const showDate = type === 'speaking' || type === 'event';

  if (state.ok) {
    return (
      <div className="card" role="status">
        <p className="display-md">Message received.</p>
        <p className="mt-3 text-cream/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative grid gap-5" noValidate>
      <Honeypot />
      {lockType ? (
        <input type="hidden" name="inquiry_type" value={defaultType} />
      ) : (
        <SelectField label="What’s this about?" name="inquiry_type" options={INQUIRY_TYPES} value={type} onChange={setType} error={e.inquiry_type} />
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" maxLength={120} error={e.name} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" maxLength={254} error={e.email} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Company or venue" name="company" autoComplete="organization" maxLength={160} error={e.company} />
        <TextField label="City" name="city" autoComplete="address-level2" maxLength={120} error={e.city} />
      </div>
      {(showBudget || showDate) && (
        <div className="grid gap-5 md:grid-cols-2">
          {showBudget && <TextField label="Budget range" name="budget_range" maxLength={120} placeholder="e.g. to be discussed" error={e.budget_range} />}
          {showDate && <TextField label="Preferred date" name="event_date" type="date" error={e.event_date} />}
        </div>
      )}
      <TextField label="Your message" name="message" rows={5} required maxLength={4000} placeholder="Tell Massi about the room, the idea, or the occasion." error={e.message} />
      <CheckField name="consent" label="I agree that Massi may contact me about this inquiry." error={e.consent} />
      <FormMessage state={state} />
      <div>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
