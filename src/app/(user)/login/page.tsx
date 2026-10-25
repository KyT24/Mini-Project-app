'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { getApiErrorMessage, useLogin } from '@/hooks/useAuth';
import {
  type FieldErrors,
  type LoginValues,
  loginSchema,
  validateEmail,
  validateLoginPassword,
} from '@/validations/login/login.schema';
import { toFieldErrors } from '@/validations/shared/fields';

export default function LoginPage() {
  // useSearchParams butuh Suspense boundary di App Router
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';
  // Hanya path internal agar tidak bisa dipakai untuk open redirect
  const redirectParam = searchParams.get('redirect');
  const redirectTo =
    redirectParam?.startsWith('/') && !redirectParam.startsWith('//') ? redirectParam : '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [serverError, setServerError] = useState('');

  const { mutate: login, isPending: isSubmitting } = useLogin({
    onSuccess: ({ data }) => {
      const role = data.user.role;
      router.push(role === 'ADMIN' || role === 'STAFF' ? '/admin/dashboard' : redirectTo);
    },
    onError: (error) =>
      setServerError(
        getApiErrorMessage(error, 'Email atau password salah. Silakan coba lagi.'),
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
    login(parsed.data); // email sudah di-trim oleh zod
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside
        className="relative flex flex-col justify-between overflow-hidden bg-[#1B1B7A] px-6 py-10 text-white md:px-12 md:py-14 lg:py-20"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 10% 10%, rgba(60,66,190,0.7), transparent 70%), radial-gradient(50% 60% at 90% 100%, rgba(8,10,70,0.9), transparent 70%)',
        }}
      >
        <div>
          <Link
            href="/"
            aria-label="Ke beranda"
            className="inline-block rounded-md bg-[#FAF8F3] px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img src="/IH-logo-icon.png" alt="Logo klinik" className="h-9 w-auto" />
          </Link>

          <h1 className="mt-10 text-4xl font-bold tracking-tight md:text-5xl">
            Selamat datang kembali
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Masuk untuk melihat jadwal perawatan, riwayat kunjungan, dan membuat
            reservasi dengan lebih mudah.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="mt-10 hidden h-1.5 w-24 rounded-full bg-[#F29A9A] lg:block"
        />
      </aside>

      {/* FORM */}
      <section className="flex items-center justify-center px-5 py-10 md:px-10 md:py-14">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Masuk</h2>
          <p className="mt-1 text-neutral-600">Gunakan akun yang sudah terdaftar.</p>

          {justRegistered && !serverError && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
            >
              Pendaftaran berhasil. Silakan masuk dengan akun Anda.
            </div>
          )}

          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
            >
              {serverError}
            </div>
          )}

          <div className="mt-6 grid gap-5">
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setFieldError('email', validateEmail(e.target.value));
                }}
                onBlur={() => setFieldError('email', validateEmail(email))}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
                  errors.email ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>
                <Link
                  href="/lupa-password"
                  className="text-sm font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
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
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-28 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
                    errors.password ? 'border-red-600' : 'border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2px focus-visible:outline-[#1B1B7A]"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 w-full rounded-2xl bg-[#1B1B7A] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="mt-6 text-center text-neutral-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
            >
              Daftar
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
