import { z } from 'zod';
import type { TScheduleUpdate } from '@/types/schedule';
import { type FieldErrors, toFieldErrors } from '../shared/fields';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// Sama dengan validasi backend; "HH:mm" bisa dibandingkan sebagai string
export const scheduleFormSchema = z
  .object({
    day_of_week: z.string().regex(/^[0-6]$/, 'Pilih hari praktik'),
    start_time: z.string().regex(TIME_REGEX, 'Jam mulai wajib diisi'),
    end_time: z.string().regex(TIME_REGEX, 'Jam selesai wajib diisi'),
    patient_quota: z
      .string()
      .trim()
      .regex(/^\d+$/, 'Kuota harus berupa angka bulat')
      .refine((value) => Number(value) >= 1 && Number(value) <= 100, 'Kuota antara 1–100 pasien'),
  })
  .refine((data) => data.end_time > data.start_time, {
    path: ['end_time'],
    message: 'Jam selesai harus setelah jam mulai',
  });

export type ScheduleFormValues = z.input<typeof scheduleFormSchema>;
export type { FieldErrors };

export const EMPTY_SCHEDULE_FORM: ScheduleFormValues = {
  day_of_week: '1',
  start_time: '10:00',
  end_time: '12:00',
  patient_quota: '10',
};

export function parseSchedule(values: ScheduleFormValues):
  | { success: true; data: Required<Omit<TScheduleUpdate, 'is_active'>> }
  | { success: false; errors: FieldErrors<ScheduleFormValues> } {
  const result = scheduleFormSchema.safeParse(values);
  if (!result.success) return { success: false, errors: toFieldErrors(result.error) };
  return {
    success: true,
    data: {
      day_of_week: Number(result.data.day_of_week),
      start_time: result.data.start_time,
      end_time: result.data.end_time,
      patient_quota: Number(result.data.patient_quota),
    },
  };
}
