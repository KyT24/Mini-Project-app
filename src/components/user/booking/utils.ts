// Jam klinik memakai WIB (UTC+7), sama dengan backend
const CLINIC_OFFSET_MS = 7 * 60 * 60 * 1000;

// Sama dengan BOOKING_WINDOW_DAYS di backend
export const BOOKING_WINDOW_DAYS = 14;

/** Daftar tanggal "YYYY-MM-DD" yang bisa dipesan, mulai hari ini (WIB) */
export function getBookableDates() {
  const today = new Date(Date.now() + CLINIC_OFFSET_MS);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

/** "2026-10-26" atau ISO tanggal dari backend → "Senin, 26 Oktober 2026" */
export function formatDate(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Kolom @db.Time dari backend ("1970-01-01T09:00:00.000Z") → "09:00" */
export function formatTime(time: string) {
  return time.slice(11, 16);
}

/** 125 → "02:05" */
export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
