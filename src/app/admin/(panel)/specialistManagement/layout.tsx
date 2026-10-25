import RequireRole from '@/components/admin/require-role';

// Kelola spesialis (tambah, ubah, hapus) khusus ADMIN, sama dengan backend
export default function SpecialistManagementLayout({
  children,
}: LayoutProps<'/admin/specialistManagement'>) {
  return <RequireRole roles={['ADMIN']}>{children}</RequireRole>;
}
