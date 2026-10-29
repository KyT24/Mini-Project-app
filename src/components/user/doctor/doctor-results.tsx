import { getApiErrorMessage } from '@/lib/api-error';
import { secondaryBtn } from '@/lib/styles';
import type { TDoctor } from '@/types/doctor';
import { DoctorCard } from './doctor-card';

const gridClass = 'mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

type Props = {
  doctors: TDoctor[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  hasFilter: boolean;
  onRetry: () => void;
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
}: Props) {
  if (isPending) {
    return (
      <ul aria-busy="true" aria-label="Memuat data dokter" className={gridClass}>
        {Array.from({ length: 4 }).map((_, i) => (
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
      <div role="alert" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-red-900">{getApiErrorMessage(error, 'Data dokter gagal dimuat.')}</p>
        <button type="button" onClick={onRetry} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-700">
        <p>
          {hasFilter
            ? 'Tidak ada dokter yang cocok dengan pencarian atau filter.'
            : 'Belum ada data dokter yang tersedia.'}
        </p>
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
