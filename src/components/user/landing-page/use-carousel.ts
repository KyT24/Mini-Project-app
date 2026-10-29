import { useCallback, useEffect, useRef, useState } from 'react';

// Lebar satu langkah geser & indeks halaman terakhir dari isi track
function measureTrack(el: HTMLUListElement) {
  if (el.children.length === 0) return null;
  const first = el.children[0] as HTMLElement;
  const second = el.children[1] as HTMLElement | undefined;
  const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  const lastPage = Math.max(0, Math.round((el.scrollWidth - el.clientWidth) / step));
  return { step, lastPage };
}

// Carousel geser horizontal: tahu halaman aktif, jumlah halaman, dan bisa lompat ke halaman tertentu
export function useCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const update = useCallback(() => {
    const el = trackRef.current;
    const m = el && measureTrack(el);
    if (!el || !m) return;
    setPages(m.lastPage + 1);
    setPage(Math.min(Math.round(el.scrollLeft / m.step), m.lastPage));
  }, []);

  function goTo(i: number) {
    const el = trackRef.current;
    const m = el && measureTrack(el);
    if (!el || !m) return;
    const target = Math.max(0, Math.min(i, m.lastPage));
    el.scrollTo({ left: target * m.step, behavior: 'smooth' });
  }

  // Hitung ulang saat ukuran track berubah (ResizeObserver juga langsung memanggil sekali di awal)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  return { trackRef, page, pages, update, goTo };
}
