// Login admin tidak memakai sidebar (di luar route group (panel))
import Link from 'next/link';
import AdminLoginForm from '@/components/admin/auth/admin-login-form';
import { linkClass } from '@/lib/styles';

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 py-10 text-neutral-900">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-md bg-[#1B1B7A] px-3 py-1.5">
            <img src="/IH-logo-icon.png" alt="" className="h-8 w-auto" />
          </span>
          <span className="text-lg font-bold text-[#1B1B7A]">Panel Admin</span>
        </div>

        <AdminLoginForm />

        <p className="mt-6 text-center text-neutral-600">
          Bukan admin?{' '}
          <Link href="/login" className={linkClass}>
            Masuk sebagai pasien
          </Link>
        </p>
      </div>
    </main>
  );
}
