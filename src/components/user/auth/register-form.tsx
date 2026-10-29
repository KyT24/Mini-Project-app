'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRegister } from '@/hooks/api/use-auth';
import { getApiErrorMessage } from '@/lib/api-error';
import { errorText, inputClass, linkClass } from '@/lib/styles';
import {
  type FieldErrors,
  type RegisterValues,
  registerSchema,
  validateAgree,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validateNewPassword,
  validatePhone,
} from '@/validations/register/register.schema';
import { toFieldErrors } from '@/validations/shared/fields';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';

type Errors = FieldErrors<RegisterValues>;

const submitBtn =
  'mt-7 w-full rounded-2xl bg-[#1B1B7A] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500';

// Form daftar akun pasien; sukses → ke /login?registered=1
export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');

  const { mutate: register, isPending: isSubmitting } = useRegister({
    onSuccess: () => router.push('/login?registered=1'),
    onError: (error) =>
      setServerError(getApiErrorMessage(error, 'Pendaftaran gagal. Silakan coba lagi.')),
  });

  function setFieldError(field: keyof RegisterValues, message?: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  // onChange + onBlur untuk input teks: validasi ulang saat sudah ada error, dan saat keluar dari input
  function fieldHandlers(
    field: keyof RegisterValues,
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

  function changePassword(value: string) {
    setPassword(value);
    if (errors.password) setFieldError('password', validateNewPassword(value));
    // Sinkronkan konfirmasi bila sudah pernah diisi
    if (confirmPassword)
      setFieldError('confirmPassword', validateConfirmPassword(confirmPassword, value));
  }

  function changeConfirmPassword(value: string) {
    setConfirmPassword(value);
    if (errors.confirmPassword)
      setFieldError('confirmPassword', validateConfirmPassword(value, password));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const parsed = registerSchema.safeParse({ name, email, phone, password, confirmPassword, agree });
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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Daftar</h2>
      <p className="mt-1 text-neutral-600">Isi data diri Anda untuk membuat akun.</p>

      {serverError && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      <div className="mt-6 grid gap-5">
        <Field id="name" label="Nama lengkap" error={errors.name}>
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
            className={inputClass(errors.name)}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
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
            className={inputClass(errors.email)}
          />
        </Field>

        <Field id="phone" label="Nomor WhatsApp" error={errors.phone}>
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
            className={inputClass(errors.phone)}
          />
        </Field>

        <div>
          <Field id="password" label="Password" error={errors.password}>
            <PasswordInput
              id="password"
              value={password}
              onChange={changePassword}
              onBlur={() => setFieldError('password', validateNewPassword(password))}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              error={errors.password}
              hintId="password-hint"
            />
          </Field>
          {!errors.password && (
            <p id="password-hint" className="mt-1.5 text-sm text-neutral-600">
              Gunakan kombinasi huruf dan angka agar lebih aman.
            </p>
          )}
        </div>

        <Field id="confirmPassword" label="Konfirmasi password" error={errors.confirmPassword}>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={changeConfirmPassword}
            onBlur={() =>
              setFieldError('confirmPassword', validateConfirmPassword(confirmPassword, password))
            }
            autoComplete="new-password"
            placeholder="Ulangi password"
            error={errors.confirmPassword}
          />
        </Field>

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
              <Link href="/syarat-ketentuan" className={linkClass}>
                syarat dan ketentuan
              </Link>{' '}
              serta{' '}
              <Link href="/kebijakan-privasi" className={linkClass}>
                kebijakan privasi
              </Link>
              .
            </span>
          </label>
          {errors.agree && (
            <p id="agree-error" role="alert" className={errorText}>
              {errors.agree}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className={submitBtn}>
        {isSubmitting ? 'Memproses...' : 'Daftar'}
      </button>

      <p className="mt-6 text-center text-neutral-600">
        Sudah punya akun?{' '}
        <Link href="/login" className={linkClass}>
          Masuk
        </Link>
      </p>
    </form>
  );
}
