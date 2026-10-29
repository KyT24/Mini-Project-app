'use client';

import { DoctorCard } from '@/components/user/doctor/doctor-card';
import { useGetDoctors } from '@/hooks/api/use-doctors';

// Jumlah dokter yang ditampilkan di landing page
const LIMIT = 4;

export function DoctorList() {
  // Ambil dokter aktif dari backend, urut dari pengalaman terlama
  const { data, isPending, isError, refetch } = useGetDoctors({
    limit: LIMIT,
    is_active: true,
    sort: 'experience_desc',
  });

  const doctors = data?.data ?? [];

  if (isPending) {
    return (
      <ul
        aria-busy="true"
        aria-label="Memuat data dokter"
        className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4"
      >
        {Array.from({ length: LIMIT }).map((_, i) => (
          <li
            key={i}
            className="h-96 animate-pulse rounded-2xl bg-neutral-100 motion-reduce:animate-none md:rounded-3xl"
          />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-neutral-200 p-6 text-neutral-700 md:mt-10"
      >
        <p>Data dokter gagal dimuat.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 min-h-11 rounded-xl border-2 border-[#1B1B7A] px-4 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <p className="mt-8 text-neutral-600 md:mt-10">
        Belum ada data dokter yang tersedia.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4">
      {doctors.map((d) => (
        <li key={d.id}>
          <DoctorCard doctor={d} />
        </li>
      ))}
    </ul>
  );
}
