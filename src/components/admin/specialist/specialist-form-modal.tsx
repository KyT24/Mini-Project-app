'use client';

import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import Modal from '@/components/ui/modal';
import { errorText, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useCreateSpecialist, useUpdateSpecialist } from '@/hooks/api/use-specialists';
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
  const isEdit = Boolean(specialist);
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
    const hasError = Boolean(errors[field]);
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
        if (status === 409) {
          setErrors({ name: 'Nama spesialis sudah ada' });
        } else if (status === 401) {
          setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
        } else if (status === 403) {
          setServerError('Hanya admin yang boleh mengelola spesialis.');
        } else {
          setServerError(message);
        }
      },
    };

    if (specialist) {
      updateSpecialist.mutate({ id: specialist.id, body: parsed.data }, callbacks);
    } else {
      createSpecialist.mutate(parsed.data, callbacks);
    }
  }

  // Teks tombol simpan: sedang menyimpan → mode ubah → mode tambah
  let submitLabel = 'Tambah spesialis';
  if (isPending) {
    submitLabel = 'Menyimpan...';
  } else if (isEdit) {
    submitLabel = 'Simpan perubahan';
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
              onChange={(event) => setField('name', event.target.value)}
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
              onChange={(event) => setField('description', event.target.value)}
            />
            {renderError('description')}
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.is_active}
              onChange={(event) => setField('is_active', event.target.checked)}
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
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
