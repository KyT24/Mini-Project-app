// Jam klinik memakai WIB (UTC+7), sama dengan backend
const CLINIC_OFFSET_MS = 7 * 60 * 60 * 1000;

// Sama dengan BOOKING_WINDOW_DAYS di backend
export const BOOKING_WINDOW_DAYS = 14;

/** Daftar tanggal "YYYY-MM-DD" yang bisa dipesan, mulai hari ini (WIB) */
export function getBookableDates() {
  const today = new Date(Date.now() + CLINIC_OFFSET_MS);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}
