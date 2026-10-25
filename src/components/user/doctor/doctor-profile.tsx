'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  formatRupiah,
  getApiErrorMessage,
  getApiStatus,
  getInitials,
} from '@/components/admin/doctor/utils';
import { inputBase, linkClass, primaryBtn, secondaryBtn } from '@/components/user/booking/styles';
import { formatTime } from '@/components/user/booking/utils';
import { treatments } from '@/components/user/landing-page/treatment';
import { useGetDetailDoctor } from '@/hooks/useDoctors';
import { DAYS, DAY_ORDER } from './constants';

const card = 'rounded-3xl border border-neutral-200 bg-white p-5 md:p-8';

export function DoctorProfile() {
  const { doctorDetail } = useParams<{ doctorDetail: string }>();
  const { data, isPending, isError, error, refetch } = useGetDetailDoctor(doctorDetail);
  const [treatmentSlug, setTreatmentSlug] = useState('');

  const doctor = data?.data;

  if (isPending) {
    return (
      <div
        aria-busy="true"
        aria-label="Memuat profil dokter"
        className="mt-6 h-96 animate-pulse rounded-3xl bg-white motion-reduce:animate-none"
      />
    );
  }

  // 404 = tidak ada, 422 = id tidak valid; dokter nonaktif juga tidak ditampilkan
  const status = getApiStatus(error);
  if ((isError && (status === 404 || status === 422)) || (doctor && !doctor.is_active)) {
    return (
      <div className={`mt-6 ${card}`}>
        <h1 className="text-2xl font-bold text-[#1B1B7A]">Dokter tidak ditemukan</h1>
        <p className="mt-2 text-neutral-700">
          Dokter ini tidak ditemukan atau sedang tidak menerima pasien.
        </p>
        <Link href="/doctor" className={`mt-6 ${primaryBtn}`}>
          Lihat dokter lain
        </Link>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div role="alert" className={`mt-6 ${card}`}>
        <p className="text-red-900">{getApiErrorMessage(error, 'Profil dokter gagal dimuat.')}</p>
        <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );
  }

  const image = doctor.photo ?? doctor.users?.profile_picture;
  const schedules = doctor.doctor_schedules ?? [];
  const scheduleDays = DAY_ORDER.map((d) => ({
    day: d,
    items: schedules.filter((s) => s.day_of_week === d),
  })).filter((d) => d.items.length > 0);
  const canBook = scheduleDays.length > 0 && !!treatmentSlug;

  return (
    <>
      <article className={`mt-6 grid gap-6 md:grid-cols-[280px_1fr] md:gap-8 ${card}`}>
        <div className="aspect-4/5 w-full max-w-xs overflow-hidden rounded-2xl bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5 md:max-w-none">
          {image ? (
            <img
              src={image}
              alt={`Foto ${doctor.full_name}`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-6xl font-bold text-[#1B1B7A]"
            >
              {getInitials(doctor.full_name)}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
            {doctor.specialists?.name ?? 'Dokter Umum'}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1B1B7A] md:text-4xl">
            {doctor.full_name}
          </h1>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#FAF8F3] px-4 py-3">
              <dt className="text-sm text-neutral-600">Pengalaman</dt>
              <dd className="text-lg font-bold text-neutral-900">
                {doctor.experience_years} tahun
              </dd>
            </div>
            <div className="rounded-2xl bg-[#FAF8F3] px-4 py-3">
              <dt className="text-sm text-neutral-600">Biaya konsultasi</dt>
              <dd className="text-lg font-bold text-neutral-900">
                {formatRupiah(doctor.consultation_fee)}
              </dd>
            </div>
          </dl>

          {doctor.bio && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-[#1B1B7A]">Tentang dokter</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">
                {doctor.bio}
              </p>
            </div>
          )}
        </div>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="schedule-heading" className={card}>
          <h2 id="schedule-heading" className="text-xl font-bold text-[#1B1B7A]">
            Jadwal Praktik
          </h2>
          {scheduleDays.length === 0 ? (
            <p className="mt-3 text-neutral-700">Jadwal praktik belum tersedia.</p>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-200">
              {scheduleDays.map(({ day, items }) => (
                <li key={day} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                  <span className="font-semibold text-neutral-900">{DAYS[day]}</span>
                  <ul className="text-neutral-700 sm:text-right">
                    {items.map((s) => (
                      <li key={s.id}>
                        {formatTime(s.start_time)}–{formatTime(s.end_time)} WIB
                        <span className="text-sm text-neutral-600">
                          {' '}
                          · kuota {s.patient_quota} pasien
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="booking-heading" className={card}>
          <h2 id="booking-heading" className="text-xl font-bold text-[#1B1B7A]">
            Buat Reservasi
          </h2>
          <p className="mt-2 text-neutral-700">
            Pilih treatment, lalu tentukan tanggal dan jadwal di langkah berikutnya.
          </p>
          <label htmlFor="profile-treatment" className="mt-4 block font-semibold">
            Treatment
          </label>
          <select
            id="profile-treatment"
            value={treatmentSlug}
            disabled={scheduleDays.length === 0}
            onChange={(e) => setTreatmentSlug(e.target.value)}
            className={`mt-2 ${inputBase} border-neutral-300 disabled:bg-neutral-100`}
          >
            <option value="">Pilih treatment</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          {canBook ? (
            <Link
              href={`/treatment/${treatmentSlug}/booking?doctor=${doctor.id}`}
              className={`mt-5 w-full sm:w-auto ${primaryBtn}`}
            >
              Booking
            </Link>
          ) : (
            <button type="button" disabled className={`mt-5 w-full sm:w-auto ${primaryBtn}`}>
              Booking
            </button>
          )}
          {scheduleDays.length === 0 && (
            <p className="mt-2 text-sm text-neutral-600">
              Reservasi dibuka setelah dokter memiliki jadwal praktik.
            </p>
          )}
        </section>
      </div>

      <p className="mt-6">
        <Link href="/doctor" className={linkClass}>
          Lihat dokter lain
        </Link>
      </p>
    </>
  );
}
