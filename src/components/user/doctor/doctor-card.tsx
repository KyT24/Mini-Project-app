import Link from 'next/link';
import { formatRupiah, getInitials } from '@/lib/format';
import type { TDoctor } from '@/types/doctor';
import { formatPracticeDays } from '@/lib/schedule';

// Kartu dokter dipakai di landing page & halaman /doctor
export function DoctorCard({ doctor }: { doctor: TDoctor }) {
  const image = doctor.photo ?? doctor.users?.profile_picture;
  const practiceDays = formatPracticeDays(doctor.doctor_schedules ?? []);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg motion-reduce:transition-none md:rounded-3xl">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5 sm:aspect-4/5">
        {image ? (
          <img
            src={image}
            alt={`Foto ${doctor.full_name}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#1B1B7A]"
          >
            {getInitials(doctor.full_name)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
          {doctor.specialists?.name ?? 'Dokter Umum'}
        </span>
        <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">{doctor.full_name}</h3>
        <dl className="mt-2 grid gap-1 text-sm text-neutral-700 sm:text-base">
          <div>
            <dt className="sr-only">Pengalaman</dt>
            <dd>{doctor.experience_years} tahun pengalaman</dd>
          </div>
          <div>
            <dt className="sr-only">Biaya konsultasi</dt>
            <dd className="font-semibold text-neutral-900">
              {formatRupiah(doctor.consultation_fee)}
              <span className="font-normal text-neutral-600"> / konsultasi</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Hari praktik</dt>
            <dd>{practiceDays || 'Jadwal belum tersedia'}</dd>
          </div>
        </dl>
        {doctor.bio && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {doctor.bio}
          </p>
        )}
        <div className="mt-auto pt-5 md:pt-6">
          <Link
            href={`/doctor/${doctor.id}`}
            className="flex min-h-11 items-center justify-center rounded-xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] motion-reduce:transition-none md:rounded-2xl"
          >
            Lihat profil
            <span className="sr-only"> {doctor.full_name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
