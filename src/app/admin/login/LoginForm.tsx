'use client';

import { useActionState } from 'react';
import { login } from '@/actions/admin/auth';
import { FormMessage, SubmitButton, TextField } from '@/components/ui/fields';
import type { FormState } from '@/lib/types';

const initial: FormState = { ok: false };

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action] = useActionState(login, initial);
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="next" value={next ?? ''} />
      {notice && !state.message ? <FormMessage state={{ ok: false, message: notice }} /> : null}
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={e.email} />
      <TextField label="Password" name="password" type="password" required autoComplete="current-password" error={e.password} />
      <FormMessage state={state} />
      <SubmitButton pending="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
