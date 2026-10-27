import { useEffect, useRef, useState } from 'react';

export function useCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  function measure() {
    const el = trackRef.current;
    if (!el || el.children.length === 0) return null;
    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement | undefined;
    const step = second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;
    const lastPage = Math.max(
      0,
      Math.round((el.scrollWidth - el.clientWidth) / step),
    );
    return { el, step, lastPage };
  }

  function update() {
    const m = measure();
    if (!m) return;
    setPages(m.lastPage + 1);
    setPage(Math.min(Math.round(m.el.scrollLeft / m.step), m.lastPage));
  }

  function goTo(i: number) {
    const m = measure();
    if (!m) return;
    const target = Math.max(0, Math.min(i, m.lastPage));
    m.el.scrollTo({ left: target * m.step, behavior: 'smooth' });
  }

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trackRef, page, pages, update, goTo };
}
