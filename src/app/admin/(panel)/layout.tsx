import AdminShell from '@/components/admin/admin-shell';
import RequireRole from '@/components/admin/require-role';

// Semua halaman panel hanya untuk ADMIN dan STAFF
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <RequireRole roles={['ADMIN', 'STAFF']} fullScreen>
      <AdminShell>{children}</AdminShell>
    </RequireRole>
  );
}
