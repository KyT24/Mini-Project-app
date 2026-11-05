'use client';

import { useState } from 'react';
import { useGetSpecialists } from '@/hooks/api/use-specialists';
import { DAYS, DAY_ORDER } from '@/lib/schedule';
import { inputBase, secondaryBtn } from '@/lib/styles';
import { FEE_RANGES } from './constants';
import type { TDoctorFilters } from './use-doctor-filters';

const labelClass = 'font-semibold text-neutral-900';
const selectClass = `mt-2 ${inputBase} border-neutral-300`;
const tabClass =
  '-mb-px flex min-h-11 items-center whitespace-nowrap border-b-2 font-semibold text-[#1B1B7A] transition-colors hover:border-[#963535] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1B1B7A] motion-reduce:transition-none';

type Props = { filters: TDoctorFilters };

// Tab spesialis + pencarian + filter biaya & hari di atas daftar dokter
export function DoctorFilters({ filters }: Props) {
  // Daftar spesialis hanya dipakai tab ini, jadi dimuat di sini
  const specialistsQuery = useGetSpecialists({ limit: 100, is_active: true });
  const tabs = [
    { id: '', name: 'Semua' },
    ...(specialistsQuery.data?.data ?? []),
  ];

  // Di layar ponsel, filter biaya & hari dilipat agar daftar dokter cepat terlihat
  const [showMore, setShowMore] = useState(false);
  const activeMore = (filters.fee ? 1 : 0) + (filters.dayOfWeek === undefined ? 0 : 1);

  return (
    <search aria-label="Cari dan filter dokter">
      <ul
        aria-label="Filter spesialis"
        className="-mx-5 flex gap-x-6 overflow-x-auto border-b border-[#1B1B7A]/15 px-5 md:mx-0 md:gap-x-8 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tabs.map((tab) => {
          const isActive = filters.specialist === tab.id;
          return (
            <li key={tab.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => filters.changeSpecialist(tab.id)}
                className={`${tabClass} ${isActive ? 'border-[#963535]' : 'border-transparent'}`}
              >
                {tab.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="doctor-search" className={labelClass}>
            Cari dokter
          </label>
          <div className="flex items-end gap-3">
            <input
              id="doctor-search"
              type="search"
              placeholder="Nama dokter"
              value={filters.search}
              onChange={(event) => filters.changeSearch(event.target.value)}
              className={selectClass}
            />
            <button
              type="button"
              aria-expanded={showMore}
              aria-controls="doctor-more-filters"
              onClick={() => setShowMore(!showMore)}
              className={`shrink-0 px-4! sm:hidden ${secondaryBtn}`}
            >
              Filter{activeMore > 0 && ` (${activeMore})`}
            </button>
          </div>
        </div>

        <div
          id="doctor-more-filters"
          className={`${showMore ? 'grid' : 'hidden'} gap-4 sm:contents`}
        >
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
        </div>
      </div>
    </search>
  );
}
