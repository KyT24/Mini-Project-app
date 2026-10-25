'use client';

import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/components/admin/doctor/utils';
import Modal from '@/components/admin/modal';
import { errorText, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useCreateSpecialist, useUpdateSpecialist } from '@/hooks/useSpecialists';
import type { TSpecialist } from '@/types/specialist';
import {
  EMPTY_SPECIALIST_FORM,
  type FieldErrors,
  parseSpecialist,
  type SpecialistFormValues,
} from '@/validations/specialist/specialist.schema';

type Props = {
  /** Diisi saat mode ubah; kosong saat mode tambah */
  specialist?: TSpecialist;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

function toFormValues(specialist?: TSpecialist): SpecialistFormValues {
  if (!specialist) return EMPTY_SPECIALIST_FORM;
  return {
    name: specialist.name,
    description: specialist.description ?? '',
    is_active: specialist.is_active,
  };
}

export default function SpecialistFormModal({ specialist, onClose, onSuccess }: Props) {
  const isEdit = !!specialist;
  const [values, setValues] = useState<SpecialistFormValues>(() => toFormValues(specialist));
  const [errors, setErrors] = useState<FieldErrors<SpecialistFormValues>>({});
  const [serverError, setServerError] = useState('');

  const createSpecialist = useCreateSpecialist();
  const updateSpecialist = useUpdateSpecialist();
  const isPending = createSpecialist.isPending || updateSpecialist.isPending;

  function setField<K extends keyof SpecialistFormValues>(
    field: K,
    value: SpecialistFormValues[K],
  ) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Validasi ulang field yang sedang error agar pesan hilang saat diperbaiki
    if (errors[field]) {
      const result = parseSpecialist(next);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? undefined : result.errors[field],
      }));
    }
  }

  function fieldProps(field: keyof SpecialistFormValues) {
    const hasError = !!errors[field];
    return {
      id: `specialist-${field}`,
      name: field,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `specialist-${field}-error` : undefined,
      className: `mt-2 ${inputBase} ${hasError ? 'border-red-600' : 'border-neutral-300'}`,
    };
  }

  function renderError(field: keyof SpecialistFormValues) {
    if (!errors[field]) return null;
    return (
      <p id={`specialist-${field}-error`} role="alert" className={errorText}>
        {errors[field]}
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const parsed = parseSpecialist(values);
    if (!parsed.success) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});

    const callbacks = {
      onSuccess: () => {
        onSuccess(
          isEdit
            ? `Spesialis ${parsed.data.name} berhasil diperbarui.`
            : `Spesialis ${parsed.data.name} berhasil ditambahkan.`,
        );
        onClose();
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(error, 'Gagal menyimpan data spesialis.');
        const status = getApiStatus(error);
        if (status === 409) setErrors({ name: 'Nama spesialis sudah ada' });
        else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
        else if (status === 403) setServerError('Hanya admin yang boleh mengelola spesialis.');
        else setServerError(message);
      },
    };

    if (specialist) {
      updateSpecialist.mutate({ id: specialist.id, body: parsed.data }, callbacks);
    } else {
      createSpecialist.mutate(parsed.data, callbacks);
    }
  }

  return (
    <Modal
      title={isEdit ? 'Ubah spesialis' : 'Tambah spesialis'}
      titleId="specialist-form-title"
      onClose={onClose}
      locked={isPending}
    >
      <form onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
          >
            {serverError}
          </div>
        )}

        <div className="grid gap-5">
          <div>
            <label htmlFor="specialist-name" className="font-semibold">
              Nama spesialis
            </label>
            <input
              {...fieldProps('name')}
              type="text"
              placeholder="Dermatologi"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            {renderError('name')}
          </div>

          <div>
            <label htmlFor="specialist-description" className="font-semibold">
              Deskripsi <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            <textarea
              {...fieldProps('description')}
              rows={4}
              placeholder="Penjelasan singkat bidang spesialis"
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
            {renderError('description')}
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(e) => setField('is_active', e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300 accent-[#1B1B7A]"
            />
            <span>
              <span className="font-semibold">Aktif</span>
              <span className="block text-sm text-neutral-600">
                Spesialis aktif bisa dipilih saat menambah atau mengubah dokter.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={isPending} className={secondaryBtn}>
            Batal
          </button>
          <button type="submit" disabled={isPending} className={primaryBtn}>
            {isPending ? 'Menyimpan...' : isEdit ? 'Simpan perubahan' : 'Tambah spesialis'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
