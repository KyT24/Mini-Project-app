import { z } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailField = z
  .string()
  .trim()
  .min(1, 'Email wajib diisi')
  .max(254, 'Email terlalu panjang')
  .regex(EMAIL_REGEX, 'Format email tidak valid');

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
