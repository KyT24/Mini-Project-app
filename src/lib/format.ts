/** "Dirga Saputra" → "DS" */
export function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/** 150000 atau "150000.00" → "Rp150.000" */
export function formatRupiah(value: string | number) {
  const n = Number(value);
  if (Number.isNaN(n)) return '-';
  return n.toLocaleString('id-ID', {
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
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
