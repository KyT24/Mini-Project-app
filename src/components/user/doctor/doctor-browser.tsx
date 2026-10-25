'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/components/admin/doctor/utils';
import { inputBase, secondaryBtn } from '@/components/user/booking/styles';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetDoctors } from '@/hooks/useDoctors';
import { useGetSpecialists } from '@/hooks/useSpecialists';
import { DAYS, DAY_ORDER, FEE_RANGES } from './constants';
import { DoctorCard } from './doctor-card';

const LIMIT = 12;

const labelClass = 'font-semibold text-neutral-900';

export function DoctorBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Filter disimpan di URL agar bisa dibagikan & tombol back tetap bekerja
  const q = params.get('q') ?? '';
  const specialist = params.get('specialist') ?? '';
  const feeValue = params.get('fee') ?? '';
  const dayValue = params.get('day') ?? '';
  const page = Math.max(Number(params.get('page')) || 1, 1);

  const fee = FEE_RANGES.find((f) => f.value === feeValue);
  const day = Number(dayValue);
  const dayOfWeek = dayValue !== '' && Number.isInteger(day) && day >= 0 && day <= 6 ? day : undefined;
  const hasFilter = !!(q || specialist || fee || dayOfWeek !== undefined);

  function setParams(next: Record<string, string | undefined>, resetPage = true) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => (value ? sp.set(key, value) : sp.delete(key)));
    if (resetPage) sp.delete('page');
    const query = sp.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // Ketikan disimpan lokal, URL (dan request API) baru berubah setelah jeda
  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebounce(search.trim());

  useEffect(() => {
    if (debouncedSearch !== q) setParams({ q: debouncedSearch || undefined });
    // setParams & q sengaja tidak dimasukkan: efek hanya mengikuti ketikan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // URL berubah dari luar (tombol back/forward): samakan isi kotak pencarian
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    if (q !== search.trim()) setSearch(q);
  }

  function resetFilters() {
    setSearch('');
    router.replace(pathname, { scroll: false });
  }

  const specialistsQuery = useGetSpecialists({ limit: 100, is_active: true });
  const specialists = specialistsQuery.data?.data ?? [];

  const { data, isPending, isError, error, refetch, isFetching } = useGetDoctors({
    page,
    limit: LIMIT,
    is_active: true,
    sort: 'experience_desc',
    search: q || undefined,
    specialist_id: specialist || undefined,
    min_fee: fee?.min_fee,
    max_fee: fee?.max_fee,
    day_of_week: dayOfWeek,
  });

  const doctors = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(meta?.total_pages ?? 1, 1);

  return (
    <div className="mt-8 md:mt-10">
      {/* FILTER */}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`mt-2 ${inputBase} border-neutral-300`}
          />
        </div>

        <div>
          <label htmlFor="doctor-specialist" className={labelClass}>
            Spesialis
          </label>
          <select
            id="doctor-specialist"
            value={specialist}
            onChange={(e) => setParams({ specialist: e.target.value || undefined })}
            className={`mt-2 ${inputBase} border-neutral-300`}
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
            value={fee ? feeValue : ''}
            onChange={(e) => setParams({ fee: e.target.value || undefined })}
            className={`mt-2 ${inputBase} border-neutral-300`}
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
            value={dayOfWeek === undefined ? '' : String(dayOfWeek)}
            onChange={(e) => setParams({ day: e.target.value || undefined })}
            className={`mt-2 ${inputBase} border-neutral-300`}
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

      {/* HASIL */}
      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-neutral-700">
          {meta ? `${meta.total} dokter ditemukan` : ''}
        </p>
        {hasFilter && (
          <button type="button" onClick={resetFilters} className={secondaryBtn}>
            Reset filter
          </button>
        )}
      </div>

      {isPending ? (
        <ul
          aria-busy="true"
          aria-label="Memuat data dokter"
          className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-96 animate-pulse rounded-2xl bg-neutral-100 motion-reduce:animate-none md:rounded-3xl"
            />
          ))}
        </ul>
      ) : isError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-red-900">{getApiErrorMessage(error, 'Data dokter gagal dimuat.')}</p>
          <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
            Coba lagi
          </button>
        </div>
      ) : doctors.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-700">
          <p>
            {hasFilter
              ? 'Tidak ada dokter yang cocok dengan pencarian atau filter.'
              : 'Belum ada data dokter yang tersedia.'}
          </p>
        </div>
      ) : (
        <ul
          aria-busy={isFetching}
          className={`mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            isFetching ? 'opacity-60' : ''
          }`}
        >
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      )}

      {/* PAGINASI */}
      {meta && meta.total > LIMIT && (
        <nav
          aria-label="Paginasi daftar dokter"
          className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <p className="text-neutral-600">
            Halaman {meta.page} dari {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setParams({ page: String(page - 1) }, false)}
              disabled={page <= 1 || isFetching}
              className={secondaryBtn}
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setParams({ page: String(page + 1) }, false)}
              disabled={page >= totalPages || isFetching}
              className={secondaryBtn}
            >
              Berikutnya
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
