import { z } from 'zod';
import type { TSpecialistCreate } from '@/types/specialist';
import { type FieldErrors, toFieldErrors } from '../shared/fields';

const specialistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama spesialis wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  description: z.string().trim(),
  is_active: z.boolean(),
});

export type SpecialistFormValues = z.input<typeof specialistFormSchema>;
export type { FieldErrors };

export const EMPTY_SPECIALIST_FORM: SpecialistFormValues = {
  name: '',
  description: '',
  is_active: true,
};

export function parseSpecialist(
  values: SpecialistFormValues,
):
  | { success: true; data: TSpecialistCreate }
  | { success: false; errors: FieldErrors<SpecialistFormValues> } {
  const result = specialistFormSchema.safeParse(values);
  if (!result.success)
    return { success: false, errors: toFieldErrors(result.error) };
  return {
    success: true,
    data: {
      name: result.data.name,
      description: result.data.description || null,
      is_active: result.data.is_active,
    },
  };
}
