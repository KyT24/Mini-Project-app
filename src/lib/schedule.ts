// Indeks sama dengan day_of_week backend (0 = Minggu)
export const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

// Urutan tampil Senin → Minggu
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** Hari praktik unik, urut Senin → Minggu: "Senin, Rabu" */
export function formatPracticeDays(schedules: { day_of_week: number }[]) {
  const days = new Set(schedules.map((s) => s.day_of_week));
  return DAY_ORDER.filter((d) => days.has(d))
    .map((d) => DAYS[d])
    .join(', ');
}
