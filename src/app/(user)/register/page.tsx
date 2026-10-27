'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getApiErrorMessage, useRegister } from '@/hooks/useAuth';
import {
  type FieldErrors,
  type RegisterValues,
  validateAgree,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validateNewPassword,
  validatePhone,
  registerSchema,
} from '@/validations/register/register.schema';
import { toFieldErrors } from '@/validations/shared/fields';

type Errors = FieldErrors<RegisterValues>;

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

const toggleBtn =
  'absolute inset-y-0 right-0 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

const linkClass =
  'font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');

  const { mutate: register, isPending: isSubmitting } = useRegister({
    onSuccess: () => router.push('/login?registered=1'),
    onError: (error) =>
      setServerError(
        getApiErrorMessage(error, 'Pendaftaran gagal. Silakan coba lagi.'),
      ),
  });

  function setFieldError(field: keyof RegisterValues, message?: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function fieldHandlers<K extends keyof RegisterValues>(
    field: K,
    validate: (value: string) => string | undefined,
    current: string,
    set: (v: string) => void,
  ) {
    return {
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.target.value);
        if (errors[field]) setFieldError(field, validate(e.target.value));
      },
      onBlur: () => setFieldError(field, validate(current)),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const parsed = registerSchema.safeParse({
      name,
      email,
      phone,
      password,
      confirmPassword,
      agree,
    });
    if (!parsed.success) {
      setErrors(toFieldErrors<RegisterValues>(parsed.error));
      return;
    }
    setErrors({});
    const data = parsed.data; // sudah di-trim & tervalidasi

    register({
      full_name: data.name,
      email: data.email,
      phone_number: data.phone.replace(/[\s-]/g, ''),
      password: data.password,
    });
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* PANEL BRAND */}
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
            className="inline-block rounded-md bg-white px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src="/IH-logo-icon.png"
              alt="Logo klinik"
              className="h-9 w-auto"
            />
          </Link>

          <h1 className="mt-10 text-4xl font-bold tracking-tight md:text-5xl">
            Buat akun baru
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Daftar sekali, lalu atur jadwal perawatan dan pantau riwayat
            kunjungan Anda kapan saja.
          </p>

          <ul className="mt-8 hidden max-w-md gap-3 text-white/90 lg:grid">
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Reservasi perawatan tanpa antre telepon
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Lihat riwayat kunjungan dan perawatan
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Pengingat jadwal lewat WhatsApp
            </li>
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="mt-10 hidden h-1.5 w-24 rounded-full bg-[#F29A9A] lg:block"
        />
      </aside>

      <section className="flex items-center justify-center px-5 py-10 md:px-10 md:py-14">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">
            Daftar
          </h2>
          <p className="mt-1 text-neutral-600">
            Isi data diri Anda untuk membuat akun.
          </p>

          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
            >
              {serverError}
            </div>
          )}

          <div className="mt-6 grid gap-5">
            {/* NAMA */}
            <div>
              <label
                htmlFor="name"
                className="font-semibold"
              >
                Nama lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nama sesuai identitas"
                value={name}
                {...fieldHandlers('name', validateName, name, setName)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`mt-2 ${inputBase} ${
                  errors.name ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="font-semibold"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                {...fieldHandlers('email', validateEmail, email, setEmail)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`mt-2 ${inputBase} ${
                  errors.email ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* NOMOR WHATSAPP */}
            <div>
              <label
                htmlFor="phone"
                className="font-semibold"
              >
                Nomor WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxx"
                value={phone}
                {...fieldHandlers('phone', validatePhone, phone, setPhone)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={`mt-2 ${inputBase} ${
                  errors.phone ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="font-semibold"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setFieldError(
                        'password',
                        validateNewPassword(e.target.value),
                      );
                    // Sinkronkan konfirmasi bila sudah pernah diisi
                    if (confirmPassword)
                      setFieldError(
                        'confirmPassword',
                        validateConfirmPassword(
                          confirmPassword,
                          e.target.value,
                        ),
                      );
                  }}
                  onBlur={() =>
                    setFieldError('password', validateNewPassword(password))
                  }
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'password-error' : 'password-hint'
                  }
                  className={`${inputBase} pr-28 ${
                    errors.password ? 'border-red-600' : 'border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className={toggleBtn}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.password ? (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.password}
                </p>
              ) : (
                <p
                  id="password-hint"
                  className="mt-1.5 text-sm text-neutral-600"
                >
                  Gunakan kombinasi huruf dan angka agar lebih aman.
                </p>
              )}
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="font-semibold"
              >
                Konfirmasi password
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setFieldError(
                        'confirmPassword',
                        validateConfirmPassword(e.target.value, password),
                      );
                  }}
                  onBlur={() =>
                    setFieldError(
                      'confirmPassword',
                      validateConfirmPassword(confirmPassword, password),
                    )
                  }
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? 'confirm-error' : undefined
                  }
                  className={`${inputBase} pr-28 ${
                    errors.confirmPassword
                      ? 'border-red-600'
                      : 'border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-pressed={showConfirm}
                  className={toggleBtn}
                >
                  {showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SYARAT & KETENTUAN */}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setFieldError('agree', validateAgree(e.target.checked));
                  }}
                  aria-invalid={!!errors.agree}
                  aria-describedby={errors.agree ? 'agree-error' : undefined}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300 accent-[#1B1B7A]"
                />
                <span>
                  Saya menyetujui{' '}
                  <Link
                    href="/syarat-ketentuan"
                    className={linkClass}
                  >
                    syarat dan ketentuan
                  </Link>{' '}
                  serta{' '}
                  <Link
                    href="/kebijakan-privasi"
                    className={linkClass}
                  >
                    kebijakan privasi
                  </Link>
                  .
                </span>
              </label>
              {errors.agree && (
                <p
                  id="agree-error"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-red-700"
                >
                  {errors.agree}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 w-full rounded-2xl bg-[#1B1B7A] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="mt-6 text-center text-neutral-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className={linkClass}
            >
              Masuk
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
