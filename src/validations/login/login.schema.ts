import { z } from 'zod';
import {
  type FieldErrors,
  emailField,
  firstError,
  toFieldErrors,
} from '../shared/fields';

const passwordField = z.string().min(1, 'Password wajib diisi');

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type { FieldErrors };

export const validateEmail = (value: string) =>
  firstError(emailField.safeParse(value));

export const validateLoginPassword = (value: string) =>
  firstError(passwordField.safeParse(value));

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const result = loginSchema.safeParse(values);
  return result.success ? {} : toFieldErrors<LoginValues>(result.error);
}
