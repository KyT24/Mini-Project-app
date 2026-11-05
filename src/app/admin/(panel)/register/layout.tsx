import RequireRole from '@/components/admin/require-role';

// Mendaftarkan admin baru khusus ADMIN, sama dengan backend (POST /auth/admins)
export default function AdminRegisterLayout({ children }: LayoutProps<'/admin/register'>) {
  return <RequireRole roles={['ADMIN']}>{children}</RequireRole>;
}
