'use client';

import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/types';

type Common = { label: string; name: string; error?: string[]; hint?: string; required?: boolean };

function Err({ id, error }: { id: string; error?: string[] }) {
  if (!error?.length) return null;
  return (
    <span id={id} className="error-text" role="alert">
      {error[0]}
    </span>
  );
}

export function TextField({
  label, name, error, hint, required, type = 'text', placeholder, defaultValue, maxLength, autoComplete, rows, value, onChange, list,
}: Common & {
  list?: string; type?: string; placeholder?: string; defaultValue?: string | number | null; maxLength?: number; autoComplete?: string; rows?: number;
  value?: string; onChange?: (v: string) => void;
}) {
  const id = `f-${name}`;
  const describedBy = [error?.length ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined;
  const shared = {
    id, name, required, placeholder, maxLength, autoComplete,
    'aria-invalid': error?.length ? true : undefined,
    'aria-describedby': describedBy,
    className: 'input',
  } as const;
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value) } : { defaultValue: defaultValue ?? undefined };
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? <span aria-hidden="true" className="text-copper"> *</span> : <span className="ml-1 text-xs font-normal text-cream/50">(optional)</span>}
      </label>
      {rows ? <textarea {...shared} {...controlled} rows={rows} /> : <input {...shared} {...controlled} type={type} list={list} />}
      {hint ? <span id={`${id}-hint`} className="hint">{hint}</span> : null}
      <Err id={`${id}-err`} error={error} />
    </div>
  );
}

export function SelectField({
  label, name, error, hint, required, options, defaultValue, value, onChange,
}: Common & { options: readonly { value: string; label: string }[]; defaultValue?: string; value?: string; onChange?: (v: string) => void }) {
  const id = `f-${name}`;
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) } : { defaultValue };
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <select id={id} name={name} required={required} className="input" aria-invalid={error?.length ? true : undefined} aria-describedby={error?.length ? `${id}-err` : undefined} {...controlled}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint ? <span className="hint">{hint}</span> : null}
      <Err id={`${id}-err`} error={error} />
    </div>
  );
}

export function CheckField({ label, name, error, defaultChecked }: { label: React.ReactNode; name: string; error?: string[]; defaultChecked?: boolean }) {
  const id = `f-${name}`;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--copper))]" aria-invalid={error?.length ? true : undefined} aria-describedby={error?.length ? `${id}-err` : undefined} />
        <label htmlFor={id} className="text-sm leading-snug text-cream/80">{label}</label>
      </div>
      <Err id={`${id}-err`} error={error} />
    </div>
  );
}

export function SubmitButton({ children, pending: pendingText = 'Sending…', className = 'btn-primary' }: { children: React.ReactNode; pending?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState | null | undefined }) {
  if (!state?.message) return null;
  return (
    <p role={state.ok ? 'status' : 'alert'} className={`border px-4 py-3 text-sm ${state.ok ? 'border-olive bg-olive/30 text-cream' : 'border-vermouth bg-vermouth/20 text-cream'}`}>
      {state.message}
    </p>
  );
}

/** Hidden honeypot — real people never see or fill it; bots usually do. */
export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor="f-website">Leave this field empty</label>
      <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
