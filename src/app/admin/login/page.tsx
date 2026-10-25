'use client';

// Login admin tidak memakai sidebar (di luar route group (panel))
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorText, inputBase, primaryBtn } from '@/components/admin/styles';
import { getApiErrorMessage, useLogin, useLogout, useMe } from '@/hooks/useAuth';
import type { TRole } from '@/types/auth';
import {
  type FieldErrors,
  type LoginValues,
  loginSchema,
  validateEmail,
  validateLoginPassword,
} from '@/validations/login/login.schema';
import { toFieldErrors } from '@/validations/shared/fields';

const PANEL_ROLES: TRole[] = ['ADMIN', 'STAFF'];

const linkClass =
  'font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: me } = useMe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [serverError, setServerError] = useState('');

  // Sudah login sebagai admin/staff → langsung ke dashboard
  useEffect(() => {
    if (me && PANEL_ROLES.includes(me.role)) router.replace('/admin/dashboard');
  }, [me, router]);

  const { mutate: logout } = useLogout();

  const { mutate: login, isPending: isSubmitting } = useLogin({
    onSuccess: ({ data }) => {
      if (PANEL_ROLES.includes(data.user.role)) {
        router.replace('/admin/dashboard');
        return;
      }
      // Login berhasil tapi bukan akun admin: hapus sesinya lagi
      logout();
      setServerError('Akun ini bukan akun admin. Pasien silakan masuk lewat halaman login pasien.');
    },
    onError: (error) =>
      setServerError(
        error.response?.status === 401
          ? 'Email atau password salah. Silakan coba lagi.'
          : getApiErrorMessage(error, 'Gagal masuk. Silakan coba lagi.'),
      ),
  });

  function setFieldError(field: keyof LoginValues, message?: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(toFieldErrors<LoginValues>(parsed.error));
      return;
    }
    setErrors({});
    login(parsed.data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 py-10 text-neutral-900">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-md bg-[#1B1B7A] px-3 py-1.5">
            <img src="/IH-logo-icon.png" alt="" className="h-8 w-auto" />
          </span>
          <span className="text-lg font-bold text-[#1B1B7A]">Panel Admin</span>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Masuk sebagai admin</h1>
          <p className="mt-1 text-neutral-600">Khusus admin dan staf klinik.</p>

          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
            >
              {serverError}
            </div>
          )}

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="admin-email" className="font-semibold">
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="admin@klinik.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setFieldError('email', validateEmail(e.target.value));
                }}
                onBlur={() => setFieldError('email', validateEmail(email))}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'admin-email-error' : undefined}
                className={`mt-2 ${inputBase} ${errors.email ? 'border-red-600' : 'border-neutral-300'}`}
              />
              {errors.email && (
                <p id="admin-email-error" role="alert" className={errorText}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className="font-semibold">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password Anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setFieldError('password', validateLoginPassword(e.target.value));
                  }}
                  onBlur={() => setFieldError('password', validateLoginPassword(password))}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'admin-password-error' : undefined}
                  className={`${inputBase} pr-28 ${errors.password ? 'border-red-600' : 'border-neutral-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.password && (
                <p id="admin-password-error" role="alert" className={errorText}>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={`mt-7 w-full ${primaryBtn}`}>
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Belum punya akun admin? Minta admin yang sudah ada untuk membuatkannya.
          </p>
        </form>

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
