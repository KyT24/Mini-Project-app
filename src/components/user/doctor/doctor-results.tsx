import Link from 'next/link';
import { getApiErrorMessage } from '@/lib/api-error';
import { linkClass, secondaryBtn } from '@/lib/styles';
import type { TDoctor } from '@/types/doctor';
import { DoctorCard } from './doctor-card';

const gridClass = 'mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5';
const messageClass = 'mt-4 rounded-2xl border border-[#1B1B7A]/15 bg-white p-6';

type Props = {
  doctors: TDoctor[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  hasFilter: boolean;
  onRetry: () => void;
  onReset: () => void;
};

// Hasil pencarian dokter: memuat / gagal / kosong / daftar kartu
export function DoctorResults({
  doctors,
  isPending,
  isError,
  error,
  isFetching,
  hasFilter,
  onRetry,
  onReset,
}: Props) {
  if (isPending) {
    return (
      <ul aria-busy="true" aria-label="Memuat data dokter" className={gridClass}>
        {Array.from({ length: 6 }).map((_, index) => (
          <li
            key={index}
            className="h-56 animate-pulse rounded-2xl bg-[#1B1B7A]/5 motion-reduce:animate-none"
          />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div role="alert" className={messageClass}>
        <p className="text-red-900">{getApiErrorMessage(error, 'Data dokter gagal dimuat.')}</p>
        <button type="button" onClick={onRetry} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className={messageClass}>
        {hasFilter ? (
          <>
            <p className="text-neutral-700">
              Tidak ada dokter yang cocok. Coba longgarkan pencarian atau filternya.
            </p>
            <button type="button" onClick={onReset} className={`mt-4 ${secondaryBtn}`}>
              Reset filter
            </button>
          </>
        ) : (
          <>
            <p className="text-neutral-700">Belum ada dokter yang menerima pasien saat ini.</p>
            <Link href="/treatment" className={`mt-4 inline-flex min-h-11 items-center ${linkClass}`}>
              Lihat daftar treatment
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <ul aria-busy={isFetching} className={`${gridClass} ${isFetching ? 'opacity-60' : ''}`}>
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <DoctorCard doctor={doctor} />
        </li>
      ))}
    </ul>
  );
}
