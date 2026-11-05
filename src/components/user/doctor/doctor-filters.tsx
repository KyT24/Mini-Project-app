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
          onChange={(event) => filters.changeSearch(event.target.value)}
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
          onChange={(event) => filters.changeSpecialist(event.target.value)}
          className={selectClass}
        >
          <option value="">{specialistsQuery.isPending ? 'Memuat...' : 'Semua spesialis'}</option>
          {specialists.map((specialist) => (
            <option key={specialist.id} value={specialist.id}>
              {specialist.name}
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
          onChange={(event) => filters.changeFee(event.target.value)}
          className={selectClass}
        >
          <option value="">Semua biaya</option>
          {FEE_RANGES.map((fee) => (
            <option key={fee.value} value={fee.value}>
              {fee.label}
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
          onChange={(event) => filters.changeDay(event.target.value)}
          className={selectClass}
        >
          <option value="">Semua hari</option>
          {DAY_ORDER.map((day) => (
            <option key={day} value={String(day)}>
              {DAYS[day]}
            </option>
          ))}
        </select>
      </div>
    </search>
  );
}
