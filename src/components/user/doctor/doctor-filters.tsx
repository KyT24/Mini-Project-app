'use client';

import { useGetSpecialists } from '@/hooks/api/use-specialists';
import { DAYS, DAY_ORDER } from '@/lib/schedule';
import { inputBase } from '@/lib/styles';
import { FEE_RANGES } from './constants';
import type { TDoctorFilters } from './use-doctor-filters';

const labelClass = 'font-semibold text-neutral-900';
const selectClass = `mt-2 ${inputBase} border-neutral-300`;

type Props = { filters: TDoctorFilters };

// Kotak pencarian + 3 dropdown filter di atas daftar dokter
export function DoctorFilters({ filters }: Props) {
  // Daftar spesialis hanya dipakai dropdown ini, jadi dimuat di sini
  const specialistsQuery = useGetSpecialists({ limit: 100, is_active: true });
  const specialists = specialistsQuery.data?.data ?? [];

  return (
    <search
      aria-label="Cari dan filter dokter"
      className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]"
    >
      <div>
        <label htmlFor="doctor-search" className={labelClass}>
          Cari dokter
        </label>
        <input
          id="doctor-search"
          type="search"
          placeholder="Nama dokter"
          value={filters.search}
          onChange={(e) => filters.changeSearch(e.target.value)}
          className={selectClass}
        />
      </div>

      <div>
        <label htmlFor="doctor-specialist" className={labelClass}>
          Spesialis
        </label>
        <select
          id="doctor-specialist"
          value={filters.specialist}
          onChange={(e) => filters.changeSpecialist(e.target.value)}
          className={selectClass}
        >
          <option value="">{specialistsQuery.isPending ? 'Memuat...' : 'Semua spesialis'}</option>
          {specialists.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="doctor-fee" className={labelClass}>
          Biaya konsultasi
        </label>
        <select
          id="doctor-fee"
          value={filters.fee?.value ?? ''}
          onChange={(e) => filters.changeFee(e.target.value)}
          className={selectClass}
        >
          <option value="">Semua biaya</option>
          {FEE_RANGES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="doctor-day" className={labelClass}>
          Hari praktik
        </label>
        <select
          id="doctor-day"
          value={filters.dayOfWeek === undefined ? '' : String(filters.dayOfWeek)}
          onChange={(e) => filters.changeDay(e.target.value)}
          className={selectClass}
        >
          <option value="">Semua hari</option>
          {DAY_ORDER.map((d) => (
            <option key={d} value={String(d)}>
              {DAYS[d]}
            </option>
          ))}
        </select>
      </div>
    </search>
  );
}
