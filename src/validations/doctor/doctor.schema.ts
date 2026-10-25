import { z } from 'zod';
import type { TDoctorCreate, TDoctorUpdate } from '@/types/doctor';
import {
  type FieldErrors,
  emailField,
  passwordField,
  phoneField,
  toFieldErrors,
} from '../shared/fields';

// Sama dengan validasi backend: Decimal(12,2), maks 10 digit + 2 desimal
const FEE_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

const doctorBaseSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, 'Nama lengkap wajib diisi')
    .max(150, 'Nama maksimal 150 karakter'),
  bio: z.string().trim(),
  experience_years: z
    .string()
    .trim()
    .min(1, 'Pengalaman wajib diisi')
    .regex(/^\d+$/, 'Pengalaman harus berupa angka bulat 0 atau lebih')
    .refine((v) => Number(v) <= 80, 'Pengalaman maksimal 80 tahun'),
  consultation_fee: z
    .string()
    .trim()
    .min(1, 'Biaya konsultasi wajib diisi')
    .regex(FEE_REGEX, 'Biaya harus angka 0 atau lebih, tanpa titik ribuan'),
  photo: z.string().trim().max(255, 'URL foto maksimal 255 karakter'),
  // '' = belum dipilih
  specialist_id: z.string(),
  is_active: z.boolean(),
});

// Saat tambah dokter, akun login ikut dibuat
export const doctorCreateFormSchema = doctorBaseSchema.extend({
  email: emailField,
  phone_number: phoneField,
  password: passwordField,
});

export const doctorUpdateFormSchema = doctorBaseSchema;

export type DoctorFormValues = z.input<typeof doctorCreateFormSchema>;
export type { FieldErrors };

export const EMPTY_DOCTOR_FORM: DoctorFormValues = {
  email: '',
  phone_number: '',
  password: '',
  full_name: '',
  bio: '',
  experience_years: '0',
  consultation_fee: '0',
  photo: '',
  specialist_id: '',
  is_active: true,
};

type BaseOutput = z.output<typeof doctorBaseSchema>;

function toPayload(data: BaseOutput): TDoctorUpdate {
  return {
    full_name: data.full_name,
    bio: data.bio || null,
    experience_years: Number(data.experience_years),
    consultation_fee: data.consultation_fee,
    photo: data.photo || null,
    specialist_id: data.specialist_id || null,
    is_active: data.is_active,
  };
}

export function parseDoctorCreate(values: DoctorFormValues):
  | { success: true; data: TDoctorCreate }
  | { success: false; errors: FieldErrors<DoctorFormValues> } {
  const result = doctorCreateFormSchema.safeParse(values);
  if (!result.success)
    return { success: false, errors: toFieldErrors(result.error) };
  return {
    success: true,
    data: {
      email: result.data.email,
      phone_number: result.data.phone_number.replace(/[\s-]/g, ''),
      password: result.data.password,
      ...toPayload(result.data),
    } as TDoctorCreate,
  };
}

export function parseDoctorUpdate(values: DoctorFormValues):
  | { success: true; data: TDoctorUpdate }
  | { success: false; errors: FieldErrors<DoctorFormValues> } {
  const result = doctorUpdateFormSchema.safeParse(values);
  if (!result.success)
    return { success: false, errors: toFieldErrors(result.error) };
  return { success: true, data: toPayload(result.data) };
}
