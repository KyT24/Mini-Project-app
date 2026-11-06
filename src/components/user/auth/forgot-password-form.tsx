'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForgotPassword } from '@/hooks/api/use-auth';
import { getApiErrorMessage } from '@/lib/api-error';
import { inputClass, linkClass } from '@/lib/styles';
import {
  type FieldErrors,
  type ForgotPasswordValues,
  forgotPasswordSchema,
} from '@/validations/password/password.schema';
import { toFieldErrors } from '@/validations/shared/fields';
import { Field } from '@/components/ui/field';

const submitBtn =
  'mt-7 w-full rounded-2xl bg-[#1B1B7A] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500';

// Form minta link reset. Pesan suksesnya sama untuk email terdaftar maupun tidak.
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FieldErrors<ForgotPasswordValues>>({});
  const [serverError, setServerError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const { mutate: forgotPassword, isPending: isSubmitting } = useForgotPassword({
    onSuccess: () => setIsSent(true),
    onError: (error) =>
      setServerError(getApiErrorMessage(error, 'Permintaan gagal. Silakan coba lagi.')),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError('');

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(toFieldErrors<ForgotPasswordValues>(parsed.error));
      return;
    }
    setErrors({});
    forgotPassword(parsed.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
    >
      <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Lupa password</h1>
      <p className="mt-1 text-neutral-600">
        Masukkan email akun Anda untuk menerima link reset password.
      </p>

      {isSent ? (
        <div
          role="status"
          className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
        >
          Jika email terdaftar, link reset telah dikirim. Periksa kotak masuk dan folder spam. Link
          berlaku 15 menit.
        </div>
      ) : (
        <>
          {serverError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
            >
              {serverError}
            </div>
          )}

          <div className="mt-6">
            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={inputClass(errors.email)}
              />
            </Field>
          </div>

          <button type="submit" disabled={isSubmitting} className={submitBtn}>
            {isSubmitting ? 'Memproses...' : 'Kirim link reset'}
          </button>
        </>
      )}

      <p className="mt-6 text-center">
        <Link href="/login" className={linkClass}>
          Kembali ke halaman masuk
        </Link>
      </p>
    </form>
  );
}
