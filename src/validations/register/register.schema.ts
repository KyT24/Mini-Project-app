import { z } from 'zod';
import {
  type FieldErrors,
  emailField,
  firstError,
  nameField,
  passwordField,
  phoneField,
  toFieldErrors,
} from '../shared/fields';

const confirmPasswordField = z.string().min(1, 'Konfirmasi password wajib diisi');

const agreeField = z
  .boolean()
  .refine((value) => value, { message: 'Anda perlu menyetujui syarat dan ketentuan' });

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
    agree: agreeField,
  })
  .refine((values) => !values.confirmPassword || values.confirmPassword === values.password, {
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
