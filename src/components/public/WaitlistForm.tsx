'use client';

import { useActionState } from 'react';
import { joinWaitlist } from '@/actions/public';
import { CheckField, FormMessage, Honeypot, SubmitButton, TextField } from '@/components/ui/fields';
import type { FormState } from '@/lib/types';

const initial: FormState = { ok: false };

export function WaitlistForm() {
  const [state, action] = useActionState(joinWaitlist, initial);
  const e = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="card" role="status">
        <p className="display-md">You’re on the waitlist.</p>
        <p className="mt-3 text-cream/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" maxLength={120} error={e.name} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" maxLength={254} error={e.email} />
      </div>
      <TextField label="City" name="city" required autoComplete="address-level2" maxLength={120} error={e.city} />
      <TextField label="Dietary restrictions" name="dietary_restrictions" maxLength={500} placeholder="Allergies, vegetarian, none…" error={e.dietary_restrictions} />
      <TextField label="Anything else we should know?" name="note" rows={3} maxLength={1000} error={e.note} />
      <CheckField name="consent" label="I agree to be contacted about Secret Diners. Joining the waitlist does not guarantee a seat." error={e.consent} />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending="Joining…">Join the waitlist</SubmitButton>
      </div>
    </form>
  );
}
