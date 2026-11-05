import { useCallback, useEffect, useRef, useState } from 'react';

// Lebar satu langkah geser & indeks halaman terakhir dari isi track
function measureTrack(el: HTMLUListElement) {
  if (el.children.length === 0) return null;
  const first = el.children[0] as HTMLElement;
  const second = el.children[1] as HTMLElement | undefined;
  // Jarak antar kartu = satu langkah geser (kalau hanya 1 kartu, pakai lebarnya)
  let step = first.offsetWidth;
  if (second) {
    step = second.offsetLeft - first.offsetLeft;
  }

  // Sisa lebar yang bisa digeser dibagi satu langkah = indeks halaman terakhir
  const scrollableWidth = el.scrollWidth - el.clientWidth;
  const lastPage = Math.max(0, Math.round(scrollableWidth / step));
  return { step, lastPage };
}

// Carousel geser horizontal: tahu halaman aktif, jumlah halaman, dan bisa lompat ke halaman tertentu
export function useCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const update = useCallback(() => {
    const el = trackRef.current;
    const metrics = el && measureTrack(el);
    if (!el || !metrics) return;
    setPages(metrics.lastPage + 1);
    setPage(Math.min(Math.round(el.scrollLeft / metrics.step), metrics.lastPage));
  }, []);

  function goTo(index: number) {
    const el = trackRef.current;
    const metrics = el && measureTrack(el);
    if (!el || !metrics) return;
    const target = Math.max(0, Math.min(index, metrics.lastPage));
    el.scrollTo({ left: target * metrics.step, behavior: 'smooth' });
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
