'use client';

import { useState } from 'react';
import Modal from '@/components/admin/modal';
import { errorText, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { formatTime } from '@/components/user/booking/utils';
import { DAYS, DAY_ORDER } from '@/components/user/doctor/constants';
import {
  useCreateSchedule,
  useDeleteSchedule,
  useGetSchedules,
  useUpdateSchedule,
} from '@/hooks/useSchedules';
import type { TDoctor } from '@/types/doctor';
import type { TDoctorSchedule } from '@/types/schedule';
import {
  EMPTY_SCHEDULE_FORM,
  type FieldErrors,
  parseSchedule,
  type ScheduleFormValues,
} from '@/validations/schedule/schedule.schema';
import { getApiErrorMessage, getApiStatus } from './utils';

type Props = {
  doctor: TDoctor;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const actionLink =
  'inline-flex min-h-11 items-center rounded-lg px-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] disabled:text-neutral-500';

// Urut Senin → Minggu, lalu jam mulai
const dayRank = (day: number) => DAY_ORDER.indexOf(day as (typeof DAY_ORDER)[number]);
const sortSchedules = (items: TDoctorSchedule[]) =>
  [...items].sort(
    (a, b) => dayRank(a.day_of_week) - dayRank(b.day_of_week) || a.start_time.localeCompare(b.start_time),
  );

function toFormValues(schedule: TDoctorSchedule): ScheduleFormValues {
  return {
    day_of_week: String(schedule.day_of_week),
    start_time: formatTime(schedule.start_time),
    end_time: formatTime(schedule.end_time),
    patient_quota: String(schedule.patient_quota),
  };
}

export default function ScheduleModal({ doctor, onClose, onSuccess }: Props) {
  const [values, setValues] = useState<ScheduleFormValues>(EMPTY_SCHEDULE_FORM);
  const [errors, setErrors] = useState<FieldErrors<ScheduleFormValues>>({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const schedulesQuery = useGetSchedules(doctor.id);
  const schedules = sortSchedules(schedulesQuery.data?.data ?? []);

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const isPending = createSchedule.isPending || updateSchedule.isPending || deleteSchedule.isPending;

  function setField<K extends keyof ScheduleFormValues>(field: K, value: ScheduleFormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Validasi ulang field yang sedang error agar pesan hilang saat diperbaiki
    if (errors[field]) {
      const result = parseSchedule(next);
      setErrors((prev) => ({ ...prev, [field]: result.success ? undefined : result.errors[field] }));
    }
  }

  function fieldProps(field: keyof ScheduleFormValues) {
    const hasError = !!errors[field];
    return {
      id: `schedule-${field}`,
      name: field,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `schedule-${field}-error` : undefined,
      className: `mt-2 ${inputBase} ${hasError ? 'border-red-600' : 'border-neutral-300'}`,
    };
  }

  function renderError(field: keyof ScheduleFormValues) {
    if (!errors[field]) return null;
    return (
      <p id={`schedule-${field}-error`} role="alert" className={errorText}>
        {errors[field]}
      </p>
    );
  }

  function resetForm() {
    setValues(EMPTY_SCHEDULE_FORM);
    setErrors({});
    setEditingId(null);
  }

  function handleError(error: unknown, fallback: string) {
    const message = getApiErrorMessage(error, fallback);
    const status = getApiStatus(error);
    if (status === 409 && message.includes('overlaps'))
      setErrors({ start_time: 'Jadwal bentrok dengan jadwal lain di hari yang sama' });
    else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
    else if (status === 403) setServerError('Hanya admin yang boleh mengelola jadwal dokter.');
    else setServerError(message);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    setNotice('');

    const parsed = parseSchedule(values);
    if (!parsed.success) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});

    const label = `${DAYS[parsed.data.day_of_week]} ${parsed.data.start_time}–${parsed.data.end_time}`;
    const callbacks = {
      onSuccess: () => {
        setNotice(editingId ? `Jadwal ${label} diperbarui.` : `Jadwal ${label} ditambahkan.`);
        onSuccess(`Jadwal ${doctor.full_name} diperbarui.`);
        resetForm();
      },
      onError: (error: unknown) => handleError(error, 'Gagal menyimpan jadwal.'),
    };

    if (editingId) updateSchedule.mutate({ id: editingId, body: parsed.data }, callbacks);
    else createSchedule.mutate({ doctor_id: doctor.id, ...parsed.data }, callbacks);
  }

  function toggleActive(schedule: TDoctorSchedule) {
    setServerError('');
    setNotice('');
    updateSchedule.mutate(
      { id: schedule.id, body: { is_active: !schedule.is_active } },
      {
        onSuccess: () =>
          setNotice(schedule.is_active ? 'Jadwal dinonaktifkan.' : 'Jadwal diaktifkan kembali.'),
        onError: (error) => handleError(error, 'Gagal mengubah status jadwal.'),
      },
    );
  }

  function handleDelete(schedule: TDoctorSchedule) {
    if (confirmDeleteId !== schedule.id) {
      setConfirmDeleteId(schedule.id);
      return;
    }
    setServerError('');
    setNotice('');
    deleteSchedule.mutate(schedule.id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        if (editingId === schedule.id) resetForm();
        setNotice('Jadwal dihapus. Reservasi yang sudah dibuat tetap berlaku.');
        onSuccess(`Jadwal ${doctor.full_name} diperbarui.`);
      },
      onError: (error) => handleError(error, 'Gagal menghapus jadwal.'),
    });
  }

  return (
    <Modal
      title={`Jadwal ${doctor.full_name}`}
      titleId="schedule-modal-title"
      onClose={onClose}
      locked={isPending}
    >
      <div role="status" aria-live="polite">
        {notice && (
          <p className="mb-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-medium text-green-900">
            {notice}
          </p>
        )}
      </div>
      {serverError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      {/* DAFTAR JADWAL */}
      <section aria-labelledby="schedule-list-heading">
        <h3 id="schedule-list-heading" className="font-bold text-[#1B1B7A]">
          Jadwal praktik mingguan
        </h3>
        {schedulesQuery.isPending ? (
          <p role="status" className="mt-3 text-neutral-600">
            Memuat jadwal...
          </p>
        ) : schedulesQuery.isError ? (
          <div role="alert" className="mt-3">
            <p className="text-red-900">
              {getApiErrorMessage(schedulesQuery.error, 'Gagal memuat jadwal.')}
            </p>
            <button
              type="button"
              onClick={() => schedulesQuery.refetch()}
              className={`mt-3 ${secondaryBtn}`}
            >
              Coba lagi
            </button>
          </div>
        ) : schedules.length === 0 ? (
          <p className="mt-3 rounded-xl bg-neutral-100 px-4 py-3 text-neutral-700">
            Belum ada jadwal. Tambahkan jadwal praktik pertama di bawah.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {schedules.map((s) => (
              <li
                key={s.id}
                className={`rounded-2xl border px-4 py-3 ${
                  editingId === s.id ? 'border-[#1B1B7A] bg-[#1B1B7A]/5' : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={s.is_active ? '' : 'text-neutral-600'}>
                    <span className="font-semibold">{DAYS[s.day_of_week]}</span>{' '}
                    {formatTime(s.start_time)}–{formatTime(s.end_time)} · kuota {s.patient_quota}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      s.is_active ? 'bg-green-100 text-green-900' : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {s.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setEditingId(s.id);
                      setValues(toFormValues(s));
                      setErrors({});
                      setConfirmDeleteId(null);
                    }}
                    className={`${actionLink} text-[#1B1B7A] hover:bg-neutral-100`}
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleActive(s)}
                    className={`${actionLink} text-[#1B1B7A] hover:bg-neutral-100`}
                  >
                    {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(s)}
                    className={`${actionLink} text-red-700 hover:bg-red-50`}
                  >
                    {confirmDeleteId === s.id ? 'Yakin hapus?' : 'Hapus'}
                  </button>
                  {confirmDeleteId === s.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className={`${actionLink} text-neutral-700 hover:bg-neutral-100`}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FORM TAMBAH / UBAH */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 grid gap-5 rounded-2xl border border-neutral-200 p-4 md:p-5"
      >
        <h3 className="font-bold text-[#1B1B7A]">{editingId ? 'Ubah jadwal' : 'Tambah jadwal'}</h3>

        <div>
          <label htmlFor="schedule-day_of_week" className="font-semibold">
            Hari
          </label>
          <select
            {...fieldProps('day_of_week')}
            value={values.day_of_week}
            onChange={(e) => setField('day_of_week', e.target.value)}
          >
            {DAY_ORDER.map((d) => (
              <option key={d} value={String(d)}>
                {DAYS[d]}
              </option>
            ))}
          </select>
          {renderError('day_of_week')}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="schedule-start_time" className="font-semibold">
              Jam mulai (WIB)
            </label>
            <input
              {...fieldProps('start_time')}
              type="time"
              step={300}
              value={values.start_time}
              onChange={(e) => setField('start_time', e.target.value)}
            />
            {renderError('start_time')}
          </div>
          <div>
            <label htmlFor="schedule-end_time" className="font-semibold">
              Jam selesai (WIB)
            </label>
            <input
              {...fieldProps('end_time')}
              type="time"
              step={300}
              value={values.end_time}
              onChange={(e) => setField('end_time', e.target.value)}
            />
            {renderError('end_time')}
          </div>
        </div>

        <div>
          <label htmlFor="schedule-patient_quota" className="font-semibold">
            Kuota pasien per sesi
          </label>
          <input
            {...fieldProps('patient_quota')}
            type="text"
            inputMode="numeric"
            value={values.patient_quota}
            onChange={(e) => setField('patient_quota', e.target.value)}
          />
          {renderError('patient_quota')}
        </div>

        {editingId && (
          <p className="text-sm text-neutral-600">
            Perubahan berlaku untuk reservasi baru. Reservasi yang sudah dibuat tetap berlaku.
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {editingId && (
            <button type="button" onClick={resetForm} disabled={isPending} className={secondaryBtn}>
              Batal ubah
            </button>
          )}
          <button type="submit" disabled={isPending} className={primaryBtn}>
            {createSchedule.isPending || updateSchedule.isPending
              ? 'Menyimpan...'
              : editingId
                ? 'Simpan perubahan'
                : 'Tambah jadwal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
