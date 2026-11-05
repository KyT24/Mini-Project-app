import RequireRole from '@/components/admin/require-role';

// Verifikasi pembayaran khusus ADMIN, sama dengan backend
export default function PaymentLayout({ children }: LayoutProps<'/admin/payment'>) {
  return <RequireRole roles={['ADMIN']}>{children}</RequireRole>;
}
