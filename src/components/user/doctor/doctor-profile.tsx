'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { formatDate, formatRupiah, formatTime } from '@/lib/format';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { inputBase, primaryBtn, secondaryBtn } from '@/lib/styles';
import RatingStars from '@/components/user/booking/rating-stars';
import { isSpecialistForCategory, treatments } from '@/constants/treatments';
import { useGetDetailDoctor } from '@/hooks/api/use-doctors';
import { DAYS, DAY_ORDER } from '@/lib/schedule';
import { DoctorAvatar } from './doctor-avatar';
import { PracticeWeek } from './practice-week';

const profileCard = 'rounded-2xl border border-[#1B1B7A]/15 bg-white p-5 md:p-6';
const sectionHeading = 'text-xl font-bold text-[#1B1B7A] md:text-2xl';

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
        className="mt-4 h-96 animate-pulse rounded-2xl bg-[#1B1B7A]/5 motion-reduce:animate-none"
      />
    );
  }

  // 404 = tidak ada, 422 = id tidak valid; dokter nonaktif juga tidak ditampilkan
  const status = getApiStatus(error);
  if ((isError && (status === 404 || status === 422)) || (doctor && !doctor.is_active)) {
    return (
      <div className={`mt-4 ${profileCard}`}>
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
      <div role="alert" className={`mt-4 ${profileCard}`}>
        <p className="text-red-900">{getApiErrorMessage(error, 'Profil dokter gagal dimuat.')}</p>
        <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );
  }

  const schedules = doctor.doctor_schedules ?? [];
  const scheduleDays = DAY_ORDER.map((day) => ({
    day: day,
    items: schedules.filter((schedule) => schedule.day_of_week === day),
  })).filter((group) => group.items.length > 0);
  // Hanya treatment yang kategorinya sama dengan spesialisasi dokter ini
  const doctorTreatments = treatments.filter((treatment) =>
    isSpecialistForCategory(doctor.specialists?.name, treatment.category),
  );
  const canBook = scheduleDays.length > 0 && Boolean(treatmentSlug);
  const reviews = doctor.reviews ?? [];

  return (
    <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-5 border-b border-[#1B1B7A]/15 pb-8 sm:gap-x-8 md:col-span-2 lg:col-span-1">
        <DoctorAvatar
          doctor={doctor}
          className="h-24 w-24 text-3xl sm:row-span-2 sm:h-44 sm:w-44 sm:text-5xl"
        />
        <div className="min-w-0 sm:self-end">
          <p className="font-semibold text-[#963535]">
            {doctor.specialists?.name ?? 'Dokter Umum'}
          </p>
          <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-[#1B1B7A] wrap-break-word md:text-4xl lg:text-5xl">
            {doctor.full_name}
          </h1>
        </div>

        <dl className="col-span-2 flex flex-wrap gap-x-8 gap-y-3 sm:col-span-1 sm:col-start-2 sm:self-start">
          <div>
            <dt className="text-sm text-neutral-600">Pengalaman</dt>
            <dd className="text-lg font-bold text-neutral-900">{doctor.experience_years} tahun</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-600">Biaya konsultasi</dt>
            <dd className="text-lg font-bold text-neutral-900">
              {formatRupiah(doctor.consultation_fee)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-600">Rating</dt>
            <dd className="text-lg font-bold text-neutral-900">
              {doctor.rating_avg ? (
                <>
                  {doctor.rating_avg.toLocaleString('id-ID')}
                  <span className="text-sm font-normal text-neutral-600">
                    {' '}
                    / 5 · {doctor.rating_count} ulasan
                  </span>
                </>
              ) : (
                <span className="text-base font-normal text-neutral-700">Belum ada ulasan</span>
              )}
            </dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="schedule-heading" className="lg:col-start-1">
        <h2 id="schedule-heading" className={sectionHeading}>
          Jadwal Praktik
        </h2>
        {scheduleDays.length === 0 ? (
          <p className="mt-3 text-neutral-700">Jadwal praktik belum tersedia.</p>
        ) : (
          <>
            <div className="mt-4 max-w-md">
              <PracticeWeek schedules={schedules} />
            </div>
            <ul className="mt-3 divide-y divide-[#1B1B7A]/15">
              {scheduleDays.map(({ day, items }) => (
                <li key={day} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3">
                  <span className="font-semibold text-neutral-900">{DAYS[day]}</span>
                  <ul className="text-neutral-700 sm:text-right">
                    {items.map((schedule) => (
                      <li key={schedule.id}>
                        {formatTime(schedule.start_time)}–{formatTime(schedule.end_time)} WIB
                        <span className="text-sm text-neutral-600">
                          {' '}
                          · kuota {schedule.patient_quota} pasien
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section
        aria-labelledby="booking-heading"
        className={`self-start lg:sticky lg:top-24 lg:col-start-2 lg:row-span-3 lg:row-start-1 ${profileCard}`}
      >
        <h2 id="booking-heading" className={sectionHeading}>
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
          disabled={scheduleDays.length === 0 || doctorTreatments.length === 0}
          onChange={(event) => setTreatmentSlug(event.target.value)}
          className={`mt-2 ${inputBase} border-neutral-300 disabled:bg-neutral-100`}
        >
          <option value="">Pilih treatment</option>
          {doctorTreatments.map((treatment) => (
            <option key={treatment.slug} value={treatment.slug}>
              {treatment.title}
            </option>
          ))}
        </select>
        {canBook ? (
          <Link
            href={`/treatment/${treatmentSlug}/booking?doctor=${doctor.id}`}
            className={`mt-5 w-full ${primaryBtn}`}
          >
            Lanjut pilih jadwal
          </Link>
        ) : (
          <button type="button" disabled className={`mt-5 w-full ${primaryBtn}`}>
            Lanjut pilih jadwal
          </button>
        )}
        {!treatmentSlug && scheduleDays.length > 0 && doctorTreatments.length > 0 && (
          <p className="mt-2 text-sm text-neutral-600">Pilih treatment dulu untuk melanjutkan.</p>
        )}
        {doctorTreatments.length === 0 && (
          <p className="mt-2 text-sm text-neutral-600">
            Belum ada treatment yang sesuai dengan spesialisasi dokter ini.
          </p>
        )}
        {scheduleDays.length === 0 && (
          <p className="mt-2 text-sm text-neutral-600">
            Reservasi dibuka setelah dokter memiliki jadwal praktik.
          </p>
        )}
      </section>

      <div className="grid content-start gap-8 md:col-span-2 lg:col-span-1 lg:col-start-1">
        {doctor.bio && (
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className={sectionHeading}>
              Tentang dokter
            </h2>
            <p className="mt-2 max-w-2xl whitespace-pre-line leading-relaxed text-neutral-700">
              {doctor.bio}
            </p>
          </section>
        )}

        <section aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className={sectionHeading}>
            Ulasan pasien
          </h2>
          {reviews.length === 0 ? (
            <p className="mt-2 text-neutral-700">
              Belum ada ulasan untuk dokter ini. Ulasan pasien akan tampil di sini.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-[#1B1B7A]/15">
              {reviews.map((review) => (
                <li key={review.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <RatingStars value={review.rating} />
                    {/* Hanya nama depan untuk menjaga privasi pasien */}
                    <span className="font-semibold text-neutral-900">
                      {review.patient_profiles.users.full_name.split(' ')[0]}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  {review.review && (
                    <p className="mt-2 whitespace-pre-line text-neutral-700">{review.review}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
