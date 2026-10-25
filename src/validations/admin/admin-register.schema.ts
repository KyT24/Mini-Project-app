import { z } from 'zod';
import type { TRegister } from '@/types/auth';
import {
  type FieldErrors,
  emailField,
  nameField,
  passwordField,
  phoneField,
  toFieldErrors,
} from '../shared/fields';

// Aturan sama dengan register pasien, tanpa persetujuan syarat & ketentuan
export const adminRegisterSchema = z
  .object({
    full_name: nameField,
    email: emailField,
    phone_number: phoneField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((v) => !v.confirmPassword || v.confirmPassword === v.password, {
    path: ['confirmPassword'],
    message: 'Password tidak sama',
  });

export type AdminRegisterValues = z.input<typeof adminRegisterSchema>;
export type { FieldErrors };

export const EMPTY_ADMIN_REGISTER: AdminRegisterValues = {
  full_name: '',
  email: '',
  phone_number: '',
  password: '',
  confirmPassword: '',
};

export function parseAdminRegister(values: AdminRegisterValues):
  | { success: true; data: TRegister }
  | { success: false; errors: FieldErrors<AdminRegisterValues> } {
  const result = adminRegisterSchema.safeParse(values);
  if (!result.success)
    return { success: false, errors: toFieldErrors(result.error) };

  // confirmPassword hanya untuk validasi, tidak dikirim ke backend
  const { full_name, email, phone_number, password } = result.data;
  return {
    success: true,
    data: { full_name, email, password, phone_number: phone_number.replace(/[\s-]/g, '') },
  };
}
