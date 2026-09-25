'use client';

import { useActionState } from 'react';
import { createStaff } from '@/actions/admin/settings';
import { FormMessage, SelectField, SubmitButton, TextField } from '@/components/ui/fields';
import type { FormState } from '@/lib/types';

const initial: FormState = { ok: false };

export function StaffForm() {
  const [state, action] = useActionState(createStaff, initial);
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid max-w-xl gap-5" noValidate>
      <TextField label="Full name" name="full_name" autoComplete="off" error={e.full_name} />
      <TextField label="Email" name="email" type="email" required autoComplete="off" error={e.email} />
      <TextField label="Temporary password" name="password" type="password" required autoComplete="new-password" hint="At least 10 characters. Share it privately and ask them to change it." error={e.password} />
      <SelectField
        label="Role"
        name="role"
        defaultValue="editor"
        options={[
          { value: 'editor', label: 'Editor — posts, events, media, inquiries' },
          { value: 'admin', label: 'Admin — everything, including settings' },
        ]}
        error={e.role}
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending="Creating…">Create staff account</SubmitButton>
      </div>
    </form>
  );
}
