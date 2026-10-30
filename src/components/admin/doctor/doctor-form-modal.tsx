'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { errorText, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useCreateDoctor, useUpdateDoctor, useUploadDoctorPhoto } from '@/hooks/api/use-doctors';
import { useGetSpecialists } from '@/hooks/api/use-specialists';
import type { TDoctor, TDoctorCreate } from '@/types/doctor';
import {
  type DoctorFormValues,
  EMPTY_DOCTOR_FORM,
  type FieldErrors,
  parseDoctorCreate,
  parseDoctorUpdate,
} from '@/validations/doctor/doctor.schema';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';

// Sama dengan batas upload di backend (upload.middleware.ts)
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PHOTO_MAX_SIZE = 2 * 1024 * 1024;

type Props = {
  /** Diisi saat mode ubah; kosong saat mode tambah */
  doctor?: TDoctor;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

function toFormValues(doctor?: TDoctor): DoctorFormValues {
  if (!doctor) return EMPTY_DOCTOR_FORM;
  // Field akun hanya dipakai saat tambah, mode ubah tidak mengirimnya
  return {
    ...EMPTY_DOCTOR_FORM,
    full_name: doctor.full_name,
    bio: doctor.bio ?? '',
    experience_years: String(doctor.experience_years),
    consultation_fee: String(Number(doctor.consultation_fee)),
    photo: doctor.photo ?? '',
    specialist_id: doctor.specialist_id ?? '',
    is_active: doctor.is_active,
  };
}

export default function DoctorFormModal({ doctor, onClose, onSuccess }: Props) {
  const isEdit = Boolean(doctor);
  const [values, setValues] = useState<DoctorFormValues>(() => toFormValues(doctor));
  const [errors, setErrors] = useState<FieldErrors<DoctorFormValues>>({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [photoError, setPhotoError] = useState('');

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const uploadPhoto = useUploadDoctorPhoto();
  // Pilihan spesialis aktif; spesialis dokter saat ini tetap tampil walau sudah nonaktif
  const { data: specialistData, isPending: specialistsLoading } = useGetSpecialists({
    limit: 100,
    is_active: true,
  });
  const specialistOptions = specialistData?.data ?? [];
  const currentSpecialist = doctor?.specialists;
  const hasCurrentOption =
    !currentSpecialist || specialistOptions.some((specialist) => specialist.id === currentSpecialist.id);

  // Submit dikunci selama foto masih diunggah
  const isPending = createDoctor.isPending || updateDoctor.isPending || uploadPhoto.isPending;

  const parse = (values: DoctorFormValues) => (isEdit ? parseDoctorUpdate(values) : parseDoctorCreate(values));

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
    const hasError = Boolean(errors[field]);
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

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setPhotoError('');
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      return setPhotoError('Foto harus berformat JPG, PNG, atau WEBP.');
    }
    if (file.size > PHOTO_MAX_SIZE) return setPhotoError('Ukuran foto maksimal 2 MB.');

    uploadPhoto.mutate(file, {
      onSuccess: ({ data }) => setField('photo', data.url),
      onError: (error) => {
        const status = getApiStatus(error);
        if (status === 401) {
          setPhotoError('Sesi Anda berakhir. Silakan masuk kembali.');
        } else {
          setPhotoError(getApiErrorMessage(error, 'Gagal mengunggah foto.'));
        }
      },
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
      onError: (error: unknown) => {
        const message = getApiErrorMessage(error, 'Gagal menyimpan data dokter.');
        const status = getApiStatus(error);
        if (status === 409 && message.includes('email')) {
          setErrors({ email: 'Email sudah dipakai akun lain' });
        } else if (status === 409 && message.includes('phone')) {
          setErrors({ phone_number: 'Nomor WhatsApp sudah dipakai akun lain' });
        } else if (status === 401) {
          setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
        } else if (status === 403) {
          setServerError('Hanya admin yang boleh mengelola data dokter.');
        } else {
          setServerError(message);
        }
      },
    };

    if (doctor) {
      updateDoctor.mutate({ id: doctor.id, body: parsed.data }, callbacks);
    } else {
      createDoctor.mutate(parsed.data as TDoctorCreate, callbacks);
    }
  }

  // Teks tombol simpan: sedang menyimpan → mode ubah → mode tambah
  let submitLabel = 'Tambah dokter';
  if (isPending) {
    submitLabel = 'Menyimpan...';
  } else if (isEdit) {
    submitLabel = 'Simpan perubahan';
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
            <fieldset className="grid gap-5 rounded-2xl border border-neutral-200 p-4 md:p-5">
              <legend className="px-1 font-bold text-[#1B1B7A]">Akun login dokter</legend>

              <div>
                <label htmlFor="doctor-email" className="font-semibold">
                  Email
                </label>
                <input
                  {...fieldProps('email')}
                  type="email"
                  autoComplete="off"
                  placeholder="dokter@klinik.com"
                  value={values.email}
                  onChange={(event) => setField('email', event.target.value)}
                />
                {renderError('email')}
              </div>

              <div>
                <label htmlFor="doctor-phone_number" className="font-semibold">
                  Nomor WhatsApp
                </label>
                <input
                  {...fieldProps('phone_number')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  placeholder="081234567890"
                  value={values.phone_number}
                  onChange={(event) => setField('phone_number', event.target.value)}
                />
                {renderError('phone_number')}
              </div>

              <div>
                <label htmlFor="doctor-password" className="font-semibold">
                  Password awal
                </label>
                <div className="relative">
                  <input
                    {...fieldProps('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter, huruf dan angka"
                    value={values.password}
                    onChange={(event) => setField('password', event.target.value)}
                    className={`${fieldProps('password').className} pr-28`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-pressed={showPassword}
                    className="absolute bottom-0 right-0 top-2 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                {errors.password ? (
                  renderError('password')
                ) : (
                  <p className="mt-1.5 text-sm text-neutral-600">
                    Berikan ke dokter untuk login pertama kali.
                  </p>
                )}
              </div>
            </fieldset>
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
              onChange={(event) => setField('full_name', event.target.value)}
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
                onChange={(event) => setField('experience_years', event.target.value)}
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
                onChange={(event) => setField('consultation_fee', event.target.value)}
              />
              {renderError('consultation_fee')}
            </div>
          </div>

          <div>
            <label htmlFor="doctor-specialist_id" className="font-semibold">
              Spesialis <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            <select
              {...fieldProps('specialist_id')}
              value={values.specialist_id}
              onChange={(event) => setField('specialist_id', event.target.value)}
            >
              <option value="">
                {specialistsLoading ? 'Memuat spesialis...' : 'Pilih spesialis'}
              </option>
              {!hasCurrentOption && currentSpecialist && (
                <option value={currentSpecialist.id}>{currentSpecialist.name} (nonaktif)</option>
              )}
              {specialistOptions.map((specialist) => (
                <option key={specialist.id} value={specialist.id}>
                  {specialist.name}
                </option>
              ))}
            </select>
            {renderError('specialist_id')}
          </div>

          <div>
            <label htmlFor="doctor-photo" className="font-semibold">
              Foto <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            {values.photo && (
              <div className="mt-2 flex items-center gap-4">
                <img
                  src={values.photo}
                  alt="Pratinjau foto dokter"
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover object-top"
                />
                <button
                  type="button"
                  onClick={() => setField('photo', '')}
                  disabled={isPending}
                  className="min-h-11 rounded-xl px-3 font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] disabled:text-neutral-500"
                >
                  Hapus foto
                </button>
              </div>
            )}
            <input
              id="doctor-photo"
              type="file"
              accept={PHOTO_TYPES.join(',')}
              onChange={handlePhoto}
              disabled={isPending}
              aria-invalid={Boolean(photoError || errors.photo)}
              aria-describedby="doctor-photo-hint"
              className="mt-2 block w-full text-sm text-neutral-700 file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#1B1B7A] file:px-4 file:font-bold file:text-white hover:file:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
            />
            <p id="doctor-photo-hint" className="mt-1.5 text-sm text-neutral-600">
              JPG, PNG, atau WEBP, maksimal 2 MB.
            </p>
            {uploadPhoto.isPending && (
              <p role="status" className="mt-1.5 text-sm text-neutral-700">
                Mengunggah foto...
              </p>
            )}
            {photoError && (
              <p role="alert" className={errorText}>
                {photoError}
              </p>
            )}
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
              onChange={(event) => setField('bio', event.target.value)}
            />
            {renderError('bio')}
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
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
