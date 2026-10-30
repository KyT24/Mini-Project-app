/** "Dirga Saputra" → "DS" */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/); // "Dirga Saputra" → ["Dirga", "Saputra"]
  const firstTwoWords = words.slice(0, 2);
  const initials = firstTwoWords.map((word) => word[0]).join('').toUpperCase();
  // Nama kosong → tampilkan "?"
  return initials || '?';
}

/** 150000 atau "150000.00" → "Rp150.000" */
export function formatRupiah(value: string | number) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return '-';
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
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
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // padStart menambah 0 di depan: "2" → "02"
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');
  return `${mm}:${ss}`;
}
