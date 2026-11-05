import RequireRole from '@/components/admin/require-role';

// Kelola dokter (tambah, ubah, hapus) khusus ADMIN, sama dengan backend
export default function DoctorManagementLayout({
  children,
}: LayoutProps<'/admin/doctorManagement'>) {
  return <RequireRole roles={['ADMIN']}>{children}</RequireRole>;
}
