import { z } from 'zod';
import { type FieldErrors, emailField, passwordField } from '../shared/fields';

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((values) => !values.confirmPassword || values.confirmPassword === values.password, {
    path: ['confirmPassword'],
    message: 'Password tidak sama',
  });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type { FieldErrors };
