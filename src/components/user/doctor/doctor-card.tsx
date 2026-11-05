import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import type { TDoctor } from '@/types/doctor';
import { DoctorAvatar } from './doctor-avatar';
import { PracticeWeek } from './practice-week';

// Kartu dokter dipakai di landing page & halaman /doctor
export function DoctorCard({ doctor }: { doctor: TDoctor }) {
  const schedules = doctor.doctor_schedules ?? [];

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-[#1B1B7A]/15 bg-white p-4 transition-colors hover:border-[#1B1B7A] active:border-[#1B1B7A] motion-reduce:transition-none md:p-5">
      <div className="flex items-center gap-4">
        <DoctorAvatar doctor={doctor} className="h-16 w-16 text-xl" />
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-[#1B1B7A] wrap-break-word">
            {/* Area klik link diperluas ke seluruh kartu lewat ::after */}
            <Link
              href={`/doctor/${doctor.id}`}
              className="after:absolute after:inset-0 after:rounded-2xl group-hover:underline group-hover:underline-offset-4 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#1B1B7A]"
            >
              {doctor.full_name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-neutral-700">
            {doctor.category ?? 'Dokter Umum'}
            {' · '}
            {doctor.experience_years} tahun pengalaman
          </p>
        </div>
      </div>

      {doctor.bio && (
        <p className="mt-3 hidden text-sm leading-relaxed text-neutral-700 line-clamp-2 sm:[display:-webkit-box]">
          {doctor.bio}
        </p>
      )}

      <div className="mt-auto pt-4">
        {schedules.length > 0 ? (
          <PracticeWeek schedules={schedules} />
        ) : (
          <p className="rounded-md bg-[#1B1B7A]/5 px-3 py-1.5 text-center text-sm text-neutral-700">
            Jadwal belum tersedia
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 pt-4">
        <p>
          <span className="block text-sm text-neutral-600">Biaya konsultasi</span>
          <span className="font-semibold text-[#963535]">
            {formatRupiah(doctor.consultation_fee)}
          </span>
        </p>
        <span
          aria-hidden="true"
          className="font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4"
        >
          Lihat profil
        </span>
      </div>
    </article>
  );
}
