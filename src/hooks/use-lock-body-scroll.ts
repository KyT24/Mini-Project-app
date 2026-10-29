import { useEffect } from 'react';

// Kunci scroll halaman selama `active` (menu mobile / drawer terbuka)
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
}
