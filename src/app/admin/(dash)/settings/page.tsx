import { changeRole, revokeAccess } from '@/actions/admin/settings';
import { ConfirmForm } from '@/components/admin/ConfirmForm';
import { StaffForm } from '@/components/admin/StaffForm';
import { EmptyState, Notice, PageHeader, StatusBadge } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/lib/types';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  // Admin-only: requireAdmin() redirects editors away (RLS also prevents them reading other profiles).
  const me = await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: true });
  const profiles = (data ?? []) as Profile[];

  // Emails live in auth.users; only readable with the service role, server-side.
  const emails = new Map<string, string>();
  const svc = createServiceClient();
  if (svc) {
    try {
      const { data: list } = await svc.auth.admin.listUsers({ page: 1, perPage: 200 });
      list?.users.forEach((u) => u.email && emails.set(u.id, u.email));
    } catch {
      /* non-fatal */
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Staff accounts and roles. Only admins can see this page." />

      {error ? <Notice tone="error">Could not load staff: {error.message}</Notice> : null}

      <section aria-labelledby="staff-h" className="mb-14">
        <h2 id="staff-h" className="mb-4 font-serif text-2xl text-cream">Staff</h2>
        {profiles.length ? (
          <ul className="grid gap-3">
            {profiles.map((p) => {
              const self = p.id === me.id;
              return (
                <li key={p.id} className="card flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-cream">
                      {p.full_name || emails.get(p.id) || 'Unnamed'} {self ? <span className="text-cream/50">(you)</span> : null}
                    </p>
                    <p className="mt-0.5 break-all text-xs text-cream/60">
                      {emails.get(p.id) ?? p.id} · added {formatDate(p.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={p.role} />
                    {self ? (
                      <span className="text-xs text-cream/50">You can’t change your own role.</span>
                    ) : (
                      <>
                        <form action={changeRole} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={p.id} />
                          <label htmlFor={`role-${p.id}`} className="sr-only">Role for {p.full_name || p.id}</label>
                          <select id={`role-${p.id}`} name="role" defaultValue={p.role} className="input !w-auto !py-1.5 text-sm">
                            <option value="editor">editor</option>
                            <option value="admin">admin</option>
                          </select>
                          <button className="btn-ghost btn-sm">Save</button>
                        </form>
                        <ConfirmForm action={revokeAccess} message="Revoke this person’s dashboard access? Their login stays, but they can no longer enter the admin.">
                          <input type="hidden" name="id" value={p.id} />
                          <button className="btn-ghost btn-sm">Revoke</button>
                        </ConfirmForm>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="No staff yet">Promote your first user with the SQL in the README.</EmptyState>
        )}
      </section>

      <section aria-labelledby="new-h">
        <h2 id="new-h" className="mb-2 font-serif text-2xl text-cream">Add a staff member</h2>
        {svc ? (
          <p className="mb-6 max-w-xl text-sm text-cream/70">Creates a confirmed login and gives it dashboard access.</p>
        ) : (
          <Notice tone="error">
            SUPABASE_SERVICE_ROLE_KEY isn’t set, so accounts can’t be created from here. Add the key in your Vercel environment variables, or create users in Supabase → Authentication and promote them with SQL (see README).
          </Notice>
        )}
        <StaffForm />
      </section>
    </>
  );
}
