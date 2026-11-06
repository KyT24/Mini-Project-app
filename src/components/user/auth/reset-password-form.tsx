'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useResetPassword } from '@/hooks/api/use-auth';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { linkClass } from '@/lib/styles';
import {
  type FieldErrors,
  type ResetPasswordValues,
  resetPasswordSchema,
} from '@/validations/password/password.schema';
import { toFieldErrors } from '@/validations/shared/fields';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';

const submitBtn =
  'mt-7 w-full rounded-2xl bg-[#1B1B7A] px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500';

const formCard = 'w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 md:p-8';

const errorBox = 'mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900';

const newLinkAction = (
  <Link href="/lupa-password" className={linkClass}>
    Minta link baru
  </Link>
);

// Form password baru. Token datang dari link di email (/reset-password?token=...).
export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors<ResetPasswordValues>>({});
  const [serverError, setServerError] = useState('');
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const { mutate: resetPassword, isPending: isSubmitting } = useResetPassword({
    onSuccess: () => router.push('/login?reset=1'),
    onError: (error) => {
      if (getApiStatus(error) === 400) {
        setIsLinkInvalid(true);
        return;
      }
      setServerError(getApiErrorMessage(error, 'Password gagal diubah. Silakan coba lagi.'));
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError('');

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setErrors(toFieldErrors<ResetPasswordValues>(parsed.error));
      return;
    }
    setErrors({});
    resetPassword({ token: token ?? '', new_password: parsed.data.password });
  }

  if (!token || isLinkInvalid) {
    return (
      <div className={formCard}>
        <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Reset password</h1>
        <div role="alert" className={errorBox}>
          {token ? 'Link reset tidak valid atau sudah kedaluwarsa.' : 'Link reset tidak valid.'}
        </div>
        <p className="mt-6 text-center">{newLinkAction}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={formCard}>
      <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Buat password baru</h1>
      <p className="mt-1 text-neutral-600">Gunakan password yang belum pernah Anda pakai.</p>

      {serverError && (
        <div role="alert" className={errorBox}>
          {serverError}
        </div>
      )}

      <div className="mt-6 grid gap-5">
        <Field id="password" label="Password baru" error={errors.password}>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter, huruf dan angka"
            error={errors.password}
          />
        </Field>

        <Field id="confirmPassword" label="Konfirmasi password baru" error={errors.confirmPassword}>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            placeholder="Ulangi password baru"
            error={errors.confirmPassword}
          />
        </Field>
      </div>

      <button type="submit" disabled={isSubmitting} className={submitBtn}>
        {isSubmitting ? 'Memproses...' : 'Simpan password'}
      </button>
    </form>
  );
}
