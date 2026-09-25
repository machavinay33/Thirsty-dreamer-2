import { AdminNav } from '@/components/admin/AdminNav';
import { requireStaff } from '@/lib/auth';

// Server-side guard in addition to middleware: verifies the session AND a staff profile on every request.
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return (
    <div className="md:flex">
      <AdminNav email={staff.email} role={staff.role} />
      <main id="main" className="min-w-0 flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}
