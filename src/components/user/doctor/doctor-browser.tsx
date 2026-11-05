'use client';

import { getTotalPages, Pagination } from '@/components/ui/pagination';
import { useGetDoctors } from '@/hooks/api/use-doctors';
import { secondaryBtn } from '@/lib/styles';
import { DoctorFilters } from './doctor-filters';
import { DoctorResults } from './doctor-results';
import { useDoctorFilters } from './use-doctor-filters';

const PAGE_SIZE = 12;

// Halaman /doctor: filter (di URL) → data dokter → hasil & paginasi
export function DoctorBrowser() {
  const filters = useDoctorFilters();

  const { data, isPending, isError, error, refetch, isFetching } = useGetDoctors({
    page: filters.page,
    limit: PAGE_SIZE,
    is_active: true,
    sort: 'experience_desc',
    search: filters.q || undefined,
    specialist_id: filters.specialist || undefined,
    min_fee: filters.fee?.min_fee,
    max_fee: filters.fee?.max_fee,
    day_of_week: filters.dayOfWeek,
  });
  const meta = data?.meta;

  return (
    <div className="mt-8 md:mt-10">
      <DoctorFilters filters={filters} />

      <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-neutral-700">
          {meta ? `${meta.total} dokter ditemukan` : ''}
        </p>
        {filters.hasFilter && (
          <button type="button" onClick={filters.reset} className={secondaryBtn}>
            Reset filter
          </button>
        )}
      </div>

      <DoctorResults
        doctors={data?.data ?? []}
        isPending={isPending}
        isError={isError}
        error={error}
        isFetching={isFetching}
        hasFilter={filters.hasFilter}
        onRetry={() => refetch()}
      />

      {meta && meta.total > PAGE_SIZE && (
        <Pagination
          label="Paginasi daftar dokter"
          className="mt-8"
          page={meta.page}
          totalPages={getTotalPages(meta)}
          disabled={isFetching}
          onPageChange={filters.changePage}
          buttonClassName={secondaryBtn}
        />
      )}
    </div>
  );
}
