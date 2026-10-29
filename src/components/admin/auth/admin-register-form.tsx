'use client';

import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { errorText, inputBase, primaryBtn } from '@/components/admin/styles';
import { useRegisterAdmin } from '@/hooks/api/use-auth';
import {
  type AdminRegisterValues,
  EMPTY_ADMIN_REGISTER,
  type FieldErrors,
  parseAdminRegister,
} from '@/validations/admin/admin-register.schema';

type FieldConfig = {
  name: keyof AdminRegisterValues;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: 'tel';
};

const FIELDS: FieldConfig[] = [
  { name: 'full_name', label: 'Nama lengkap', type: 'text', autoComplete: 'off', placeholder: 'Nama admin' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'off', placeholder: 'admin@klinik.com' },
  { name: 'phone_number', label: 'Nomor WhatsApp', type: 'tel', autoComplete: 'off', placeholder: '081234567890', inputMode: 'tel' },
  { name: 'password', label: 'Password awal', type: 'password', autoComplete: 'new-password', placeholder: 'Minimal 8 karakter, huruf dan angka' },
  { name: 'confirmPassword', label: 'Konfirmasi password', type: 'password', autoComplete: 'new-password', placeholder: 'Ulangi password' },
];

// Form daftarkan admin baru (POST /auth/admins); field dibuat dari konfigurasi FIELDS
export default function AdminRegisterForm() {
  const [values, setValues] = useState<AdminRegisterValues>(EMPTY_ADMIN_REGISTER);
  const [errors, setErrors] = useState<FieldErrors<AdminRegisterValues>>({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registerAdmin, isPending } = useRegisterAdmin({
    onSuccess: ({ data }) => {
      setNotice(`${data.full_name} berhasil didaftarkan sebagai admin.`);
      setValues(EMPTY_ADMIN_REGISTER);
      setShowPassword(false);
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Gagal mendaftarkan admin.');
      const status = getApiStatus(error);
      if (status === 409 && message.includes('email'))
        setErrors({ email: 'Email sudah dipakai akun lain' });
      else if (status === 409 && message.includes('phone'))
        setErrors({ phone_number: 'Nomor WhatsApp sudah dipakai akun lain' });
      else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
      else if (status === 403) setServerError('Hanya admin yang boleh mendaftarkan admin baru.');
      else setServerError(message);
    },
  });

  function setField(field: keyof AdminRegisterValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Validasi ulang field yang sedang error agar pesan hilang saat diperbaiki
    if (errors[field]) {
      const result = parseAdminRegister(next);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? undefined : result.errors[field],
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    setNotice('');

    const parsed = parseAdminRegister(values);
    if (!parsed.success) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    registerAdmin(parsed.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 md:p-8"
    >
      {notice && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
        >
          {notice}
        </div>
      )}
      {serverError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const id = `admin-${f.name}`;
          const hasError = !!errors[f.name];
          const isPassword = f.type === 'password';
          return (
            <div
              key={f.name}
              className={f.name === 'full_name' || f.name === 'email' ? 'sm:col-span-2' : ''}
            >
              <label htmlFor={id} className="font-semibold">
                {f.label}
              </label>
              <input
                id={id}
                name={f.name}
                type={isPassword && showPassword ? 'text' : f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${id}-error` : undefined}
                className={`mt-2 ${inputBase} ${hasError ? 'border-red-600' : 'border-neutral-300'}`}
              />
              {hasError && (
                <p id={`${id}-error`} role="alert" className={errorText}>
                  {errors[f.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="h-5 w-5 rounded border-neutral-300 accent-[#1B1B7A]"
        />
        <span>Tampilkan password</span>
      </label>

      <button type="submit" disabled={isPending} className={`mt-6 ${primaryBtn}`}>
        {isPending ? 'Menyimpan...' : 'Daftarkan admin'}
      </button>
    </form>
  );
}
