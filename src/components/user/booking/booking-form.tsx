'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formatRupiah } from '@/lib/format';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { useCreateAppointment, useGetAvailability } from '@/hooks/api/use-appointments';
import { useGetDoctors } from '@/hooks/api/use-doctors';
import { card, errorText, inputBase, primaryBtn, secondaryBtn } from '@/lib/styles';
import { formatDate } from '@/lib/format';
import { getBookableDates } from './utils';

type Props = {
  treatment: { slug: string; title: string };
};

type Errors = { doctor?: string; date?: string; slot?: string };

export default function BookingForm({ treatment }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Diarahkan kembali dari halaman pembayaran karena waktu upload habis
  const expired = searchParams.get('expired') === '1';
  const dates = useMemo(() => getBookableDates(), []);
  // Dokter sudah terpilih bila datang dari halaman profil dokter (?doctor=)
  const [doctorId, setDoctorId] = useState(() => searchParams.get('doctor') ?? '');
  const [date, setDate] = useState(dates[0]);
  const [startTime, setStartTime] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');

  const doctorsQuery = useGetDoctors({ is_active: true, limit: 100, sort: 'experience_desc' });
  const doctors = doctorsQuery.data?.data ?? [];
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const availability = useGetAvailability(doctorId || undefined, date);
  const slots = availability.data?.data.slots ?? [];

  const createAppointment = useCreateAppointment({
    onSuccess: ({ data }) => router.push(`/payment/${data.id}`),
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Gagal membuat reservasi.');
      const status = getApiStatus(error);
      if (status === 409 && message.includes('quota')) {
        setErrors({ slot: 'Kuota jadwal ini baru saja penuh. Silakan pilih jadwal lain.' });
        setStartTime('');
        availability.refetch();
      } else if (status === 409 && message.includes('already'))
        setErrors({ slot: 'Anda sudah punya reservasi di jadwal ini.' });
      else if (status === 422 && message.includes('started')) {
        setErrors({ slot: 'Jadwal ini sudah dimulai. Silakan pilih jadwal lain.' });
        setStartTime('');
        availability.refetch();
      } else if (status === 422 && message.includes('not available')) {
        setErrors({ slot: 'Jadwal ini sudah tidak tersedia. Silakan pilih jadwal lain.' });
        setStartTime('');
        availability.refetch();
      } else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
      else if (status === 404 && message.includes('treatment'))
        setServerError('Treatment ini belum bisa dipesan online. Silakan hubungi klinik.');
      else setServerError(message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    const nextErrors: Errors = {};
    if (!doctorId) nextErrors.doctor = 'Pilih dokter terlebih dahulu';
    if (!date) nextErrors.date = 'Pilih tanggal';
    if (!startTime) nextErrors.slot = 'Pilih jadwal yang masih tersedia';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    createAppointment.mutate({
      treatment_slug: treatment.slug,
      doctor_id: doctorId,
      session_date: date,
      start_time: startTime,
    });
  }

  const describedBy = (field: keyof Errors) => (errors[field] ? `booking-${field}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className={card}>
      {expired && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
        >
          Waktu unggah bukti pembayaran sudah habis dan kuota Anda telah dilepas. Silakan isi ulang
          form reservasi.
        </div>
      )}
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      <div className="grid gap-6">
        {/* DOKTER */}
        <div>
          <label htmlFor="booking-doctor" className="font-semibold">
            Pilih dokter
          </label>
          <select
            id="booking-doctor"
            value={doctorId}
            aria-invalid={!!errors.doctor}
            aria-describedby={describedBy('doctor')}
            disabled={doctorsQuery.isPending}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setStartTime('');
              setErrors((p) => ({ ...p, doctor: undefined, slot: undefined }));
            }}
            className={`mt-2 ${inputBase} ${errors.doctor ? 'border-red-600' : 'border-neutral-300'}`}
          >
            <option value="">
              {doctorsQuery.isPending ? 'Memuat dokter...' : 'Pilih dokter'}
            </option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
                {d.specialists ? ` · ${d.specialists.name}` : ''}
              </option>
            ))}
          </select>
          {errors.doctor && (
            <p id="booking-doctor-error" role="alert" className={errorText}>
              {errors.doctor}
            </p>
          )}
          {doctorsQuery.isError && (
            <p role="alert" className={errorText}>
              {getApiErrorMessage(doctorsQuery.error, 'Gagal memuat daftar dokter.')}{' '}
              <button type="button" onClick={() => doctorsQuery.refetch()} className="underline">
                Coba lagi
              </button>
            </p>
          )}
          {selectedDoctor && (
            <p className="mt-2 text-sm text-neutral-600">
              {selectedDoctor.experience_years} tahun pengalaman · Biaya konsultasi{' '}
              {formatRupiah(selectedDoctor.consultation_fee)}
            </p>
          )}
        </div>

        {/* TANGGAL */}
        <div>
          <label htmlFor="booking-date" className="font-semibold">
            Tanggal
          </label>
          <select
            id="booking-date"
            value={date}
            aria-invalid={!!errors.date}
            aria-describedby={describedBy('date')}
            onChange={(e) => {
              setDate(e.target.value);
              setStartTime('');
              setErrors((p) => ({ ...p, date: undefined, slot: undefined }));
            }}
            className={`mt-2 ${inputBase} ${errors.date ? 'border-red-600' : 'border-neutral-300'}`}
          >
            {dates.map((d, i) => (
              <option key={d} value={d}>
                {formatDate(d)}
                {i === 0 ? ' (hari ini)' : ''}
              </option>
            ))}
          </select>
          {errors.date && (
            <p id="booking-date-error" role="alert" className={errorText}>
              {errors.date}
            </p>
          )}
        </div>

        {/* JADWAL & KUOTA */}
        <fieldset aria-describedby={describedBy('slot')}>
          <legend className="font-semibold">Pilih jadwal</legend>
          <p className="mt-1 text-sm text-neutral-600">
            Kuota setiap jadwal ditentukan oleh klinik.
          </p>

          {!doctorId ? (
            <p className="mt-3 rounded-xl bg-neutral-100 px-4 py-3 text-neutral-700">
              Pilih dokter dulu untuk melihat jadwal dan sisa kuota.
            </p>
          ) : availability.isPending ? (
            <p role="status" className="mt-3 text-neutral-600">
              Memuat jadwal...
            </p>
          ) : availability.isError ? (
            <div role="alert" className="mt-3">
              <p className="text-red-900">
                {getApiErrorMessage(availability.error, 'Gagal memuat jadwal.')}
              </p>
              <button
                type="button"
                onClick={() => availability.refetch()}
                className={`mt-3 ${secondaryBtn}`}
              >
                Coba lagi
              </button>
            </div>
          ) : slots.length === 0 ? (
            <p className="mt-3 rounded-xl bg-neutral-100 px-4 py-3 text-neutral-700">
              Dokter tidak praktik di tanggal ini. Silakan pilih tanggal lain.
            </p>
          ) : (
            <div
              aria-busy={availability.isFetching}
              className="mt-3 grid gap-3 sm:grid-cols-2"
            >
              {slots.map((slot) => {
                const id = `booking-slot-${slot.start_time}`;
                const checked = startTime === slot.start_time;
                const status = slot.available
                  ? `Sisa kuota ${slot.remaining} dari ${slot.quota}`
                  : slot.remaining === 0
                    ? 'Kuota penuh'
                    : 'Tidak tersedia';
                return (
                  <label
                    key={slot.start_time}
                    htmlFor={id}
                    className={`flex min-h-11 items-center gap-3 rounded-2xl border px-4 py-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#1B1B7A] ${
                      !slot.available
                        ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-600'
                        : checked
                          ? 'cursor-pointer border-[#1B1B7A] bg-[#1B1B7A]/5'
                          : 'cursor-pointer border-neutral-300 hover:border-[#1B1B7A]'
                    }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name="slot"
                      value={slot.start_time}
                      checked={checked}
                      disabled={!slot.available}
                      onChange={() => {
                        setStartTime(slot.start_time);
                        setErrors((p) => ({ ...p, slot: undefined }));
                      }}
                      className="h-5 w-5 shrink-0 accent-[#1B1B7A]"
                    />
                    <span>
                      <span className="block font-semibold">
                        {slot.start_time}–{slot.end_time} WIB
                      </span>
                      <span
                        className={`block text-sm ${
                          slot.available && slot.remaining <= 2 ? 'font-semibold text-amber-800' : ''
                        }`}
                      >
                        {status}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          {errors.slot && (
            <p id="booking-slot-error" role="alert" className={errorText}>
              {errors.slot}
            </p>
          )}
        </fieldset>
      </div>

      <div className="mt-8 rounded-2xl bg-[#FAF8F3] px-4 py-3 text-sm text-neutral-700">
        Setelah reservasi dibuat, kuota Anda ditahan selama <strong>30 menit</strong>. Unggah bukti
        pembayaran sebelum waktu habis, atau kuota akan dilepas dan Anda perlu memesan ulang.
      </div>

      <button
        type="submit"
        disabled={createAppointment.isPending}
        className={`mt-6 w-full sm:w-auto ${primaryBtn}`}
      >
        {createAppointment.isPending ? 'Memproses...' : 'Lanjut ke pembayaran'}
      </button>
    </form>
  );
}
