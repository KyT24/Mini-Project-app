import { z } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailField = z
  .string()
  .trim()
  .min(1, 'Email wajib diisi')
  .max(254, 'Email terlalu panjang')
  .regex(EMAIL_REGEX, 'Format email tidak valid');

const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

export const nameField = z
  .string()
  .trim()
  .min(1, 'Nama lengkap wajib diisi')
  .min(3, 'Nama minimal 3 karakter')
  .max(100, 'Nama maksimal 100 karakter')
  .regex(NAME_REGEX, 'Nama hanya boleh berisi huruf');

// Nomor Indonesia: 08xx / +628xx / 628xx, 9-12 digit setelah angka 8
const PHONE_REGEX = /^(\+62|62|0)8\d{8,11}$/;

export const phoneField = z
  .string()
  .trim()
  .min(1, 'Nomor WhatsApp wajib diisi')
  .refine((value) => PHONE_REGEX.test(value.replace(/[\s-]/g, '')), {
    message: 'Nomor tidak valid. Contoh: 081234567890',
  });

export const passwordField = z
  .string()
  .min(1, 'Password wajib diisi')
  .min(8, 'Password minimal 8 karakter')
  .max(72, 'Password maksimal 72 karakter')
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
    message: 'Password harus mengandung huruf dan angka',
  });

/** Pesan error pertama dari hasil parse, atau undefined bila valid. */
export function firstError(
  result: { success: boolean; error?: z.ZodError },
): string | undefined {
  return result.success ? undefined : result.error?.issues[0]?.message;
}

/** Ubah ZodError menjadi { field: pesan pertama }. */
export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors as FieldErrors<T>;
}
