'use client';

import { useState } from 'react';
import Modal from '@/components/admin/modal';
import { errorText, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useCreateDoctor, useUpdateDoctor } from '@/hooks/useDoctors';
import type { TDoctor, TDoctorCreate } from '@/types/doctor';
import {
  type DoctorFormValues,
  EMPTY_DOCTOR_FORM,
  type FieldErrors,
  parseDoctorCreate,
  parseDoctorUpdate,
} from '@/validations/doctor/doctor.schema';
import { getApiErrorMessage } from './utils';

type Props = {
  /** Diisi saat mode ubah; kosong saat mode tambah */
  doctor?: TDoctor;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

function toFormValues(doctor?: TDoctor): DoctorFormValues {
  if (!doctor) return EMPTY_DOCTOR_FORM;
  return {
    user_id: doctor.user_id,
    full_name: doctor.full_name,
    bio: doctor.bio ?? '',
    experience_years: String(doctor.experience_years),
    consultation_fee: String(Number(doctor.consultation_fee)),
    photo: doctor.photo ?? '',
    is_active: doctor.is_active,
  };
}

export default function DoctorFormModal({ doctor, onClose, onSuccess }: Props) {
  const isEdit = !!doctor;
  const [values, setValues] = useState<DoctorFormValues>(() => toFormValues(doctor));
  const [errors, setErrors] = useState<FieldErrors<DoctorFormValues>>({});
  const [serverError, setServerError] = useState('');

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const isPending = createDoctor.isPending || updateDoctor.isPending;

  const parse = (v: DoctorFormValues) => (isEdit ? parseDoctorUpdate(v) : parseDoctorCreate(v));

  function setField<K extends keyof DoctorFormValues>(field: K, value: DoctorFormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Validasi ulang field yang sedang error agar pesan hilang saat diperbaiki
    if (errors[field]) {
      const result = parse(next);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? undefined : result.errors[field],
      }));
    }
  }

  function fieldProps(field: keyof DoctorFormValues) {
    const hasError = !!errors[field];
    return {
      id: `doctor-${field}`,
      name: field,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `doctor-${field}-error` : undefined,
      className: `mt-2 ${inputBase} ${hasError ? 'border-red-600' : 'border-neutral-300'}`,
    };
  }

  function renderError(field: keyof DoctorFormValues) {
    if (!errors[field]) return null;
    return (
      <p id={`doctor-${field}-error`} role="alert" className={errorText}>
        {errors[field]}
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const parsed = parse(values);
    if (!parsed.success) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});

    const callbacks = {
      onSuccess: () => {
        onSuccess(
          isEdit
            ? `Data ${parsed.data.full_name} berhasil diperbarui.`
            : `${parsed.data.full_name} berhasil ditambahkan.`,
        );
        onClose();
      },
      onError: (error: unknown) =>
        setServerError(getApiErrorMessage(error, 'Gagal menyimpan data dokter.')),
    };

    if (doctor) {
      updateDoctor.mutate({ id: doctor.id, body: parsed.data }, callbacks);
    } else {
      createDoctor.mutate(parsed.data as TDoctorCreate, callbacks);
    }
  }

  return (
    <Modal
      title={isEdit ? 'Ubah data dokter' : 'Tambah dokter'}
      titleId="doctor-form-title"
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
          {!isEdit && (
            <div>
              <label htmlFor="doctor-user_id" className="font-semibold">
                User ID
              </label>
              <input
                {...fieldProps('user_id')}
                type="text"
                autoComplete="off"
                placeholder="UUID akun dengan role DOCTOR"
                value={values.user_id}
                onChange={(e) => setField('user_id', e.target.value)}
              />
              {errors.user_id ? (
                renderError('user_id')
              ) : (
                <p className="mt-1.5 text-sm text-neutral-600">
                  Akun harus sudah terdaftar dengan role DOCTOR.
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="doctor-full_name" className="font-semibold">
              Nama lengkap
            </label>
            <input
              {...fieldProps('full_name')}
              type="text"
              placeholder="dr. Nama Dokter, Sp.KK"
              value={values.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
            />
            {renderError('full_name')}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="doctor-experience_years" className="font-semibold">
                Pengalaman (tahun)
              </label>
              <input
                {...fieldProps('experience_years')}
                type="text"
                inputMode="numeric"
                value={values.experience_years}
                onChange={(e) => setField('experience_years', e.target.value)}
              />
              {renderError('experience_years')}
            </div>

            <div>
              <label htmlFor="doctor-consultation_fee" className="font-semibold">
                Biaya konsultasi (Rp)
              </label>
              <input
                {...fieldProps('consultation_fee')}
                type="text"
                inputMode="decimal"
                placeholder="150000"
                value={values.consultation_fee}
                onChange={(e) => setField('consultation_fee', e.target.value)}
              />
              {renderError('consultation_fee')}
            </div>
          </div>

          <div>
            <label htmlFor="doctor-photo" className="font-semibold">
              URL foto <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            <input
              {...fieldProps('photo')}
              type="url"
              placeholder="https://..."
              value={values.photo}
              onChange={(e) => setField('photo', e.target.value)}
            />
            {renderError('photo')}
          </div>

          <div>
            <label htmlFor="doctor-bio" className="font-semibold">
              Bio <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            <textarea
              {...fieldProps('bio')}
              rows={4}
              placeholder="Keahlian dan latar belakang dokter"
              value={values.bio}
              onChange={(e) => setField('bio', e.target.value)}
            />
            {renderError('bio')}
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
                Dokter aktif tampil untuk pasien dan bisa menerima reservasi.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={isPending} className={secondaryBtn}>
            Batal
          </button>
          <button type="submit" disabled={isPending} className={primaryBtn}>
            {isPending ? 'Menyimpan...' : isEdit ? 'Simpan perubahan' : 'Tambah dokter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
