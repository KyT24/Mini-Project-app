import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { FEE_RANGES } from './constants';

type FilterKey = 'q' | 'specialist' | 'fee' | 'day' | 'page';

// "3" → 3; kosong atau di luar 0–6 → undefined (semua hari)
function parseDayOfWeek(value: string | null) {
  if (value === null || value === '') return undefined;
  const day = Number(value);
  return Number.isInteger(day) && day >= 0 && day <= 6 ? day : undefined;
}

// Filter disimpan di URL agar bisa dibagikan & tombol back tetap bekerja
export function useDoctorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get('q') ?? '';
  const specialist = params.get('specialist') ?? '';
  const fee = FEE_RANGES.find((f) => f.value === params.get('fee'));
  const dayOfWeek = parseDayOfWeek(params.get('day'));
  const page = Math.max(Number(params.get('page')) || 1, 1);
  const hasFilter = Boolean(q || specialist || fee || dayOfWeek !== undefined);

  function updateUrl(next: Partial<Record<FilterKey, string>>, resetPage = true) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => (value ? sp.set(key, value) : sp.delete(key)));
    if (resetPage) sp.delete('page');
    const query = sp.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // Ketikan disimpan lokal; URL (dan request API) baru berubah setelah jeda
  const [search, setSearch] = useState(q);
  const updateSearchInUrl = useDebouncedCallback((value: string) => {
    if (value !== q) updateUrl({ q: value || undefined });
  });

  function changeSearch(value: string) {
    setSearch(value);
    updateSearchInUrl(value.trim());
  }

  // URL berubah dari luar (tombol back/forward): samakan isi kotak pencarian
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    if (q !== search.trim()) setSearch(q);
  }

  return {
    q,
    specialist,
    fee,
    dayOfWeek,
    page,
    hasFilter,
    search,
    changeSearch,
    changeSpecialist: (value: string) => updateUrl({ specialist: value || undefined }),
    changeFee: (value: string) => updateUrl({ fee: value || undefined }),
    changeDay: (value: string) => updateUrl({ day: value || undefined }),
    changePage: (next: number) => updateUrl({ page: String(next) }, false),
    reset: () => {
      changeSearch('');
      router.replace(pathname, { scroll: false });
    },
  };
}

export type TDoctorFilters = ReturnType<typeof useDoctorFilters>;
