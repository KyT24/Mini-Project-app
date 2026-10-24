import { z } from 'zod';
import {
  type FieldErrors,
  emailField,
  firstError,
  toFieldErrors,
} from '../shared/fields';

// Nomor Indonesia: 08xx / +628xx / 628xx, 9-12 digit setelah angka 8
const PHONE_REGEX = /^(\+62|62|0)8\d{8,11}$/;
const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

const nameField = z
  .string()
  .trim()
  .min(1, 'Nama lengkap wajib diisi')
  .min(3, 'Nama minimal 3 karakter')
  .max(100, 'Nama maksimal 100 karakter')
  .regex(NAME_REGEX, 'Nama hanya boleh berisi huruf');

const phoneField = z
  .string()
  .trim()
  .min(1, 'Nomor WhatsApp wajib diisi')
  .refine((v) => PHONE_REGEX.test(v.replace(/[\s-]/g, '')), {
    message: 'Nomor tidak valid. Contoh: 081234567890',
  });

const passwordField = z
  .string()
  .min(1, 'Password wajib diisi')
  .min(8, 'Password minimal 8 karakter')
  .max(72, 'Password maksimal 72 karakter')
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), {
    message: 'Password harus mengandung huruf dan angka',
  });

const confirmPasswordField = z.string().min(1, 'Konfirmasi password wajib diisi');

const agreeField = z
  .boolean()
  .refine((v) => v, { message: 'Anda perlu menyetujui syarat dan ketentuan' });

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
    agree: agreeField,
  })
  .refine((v) => !v.confirmPassword || v.confirmPassword === v.password, {
    path: ['confirmPassword'],
    message: 'Password tidak sama',
  });

export type RegisterValues = z.infer<typeof registerSchema>;
export type { FieldErrors };

export const validateEmail = (value: string) =>
  firstError(emailField.safeParse(value));

export const validateName = (value: string) =>
  firstError(nameField.safeParse(value));

export const validatePhone = (value: string) =>
  firstError(phoneField.safeParse(value));

export const validateNewPassword = (value: string) =>
  firstError(passwordField.safeParse(value));

export const validateConfirmPassword = (value: string, password: string) =>
  firstError(confirmPasswordField.safeParse(value)) ??
  (value !== password ? 'Password tidak sama' : undefined);

export const validateAgree = (value: boolean) =>
  firstError(agreeField.safeParse(value));

export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  const result = registerSchema.safeParse(values);
  return result.success ? {} : toFieldErrors<RegisterValues>(result.error);
}
