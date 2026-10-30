import { useEffect, useState } from 'react';

// Waktu sekarang yang diperbarui tiap detik selama `active` bernilai true
// (dipakai untuk hitung mundur batas waktu pembayaran)
export function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  return now;
}
