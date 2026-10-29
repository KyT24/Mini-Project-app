import { useEffect, useState } from 'react';

// Pesan sukses yang hilang sendiri setelah `delay` ms
export function useAutoDismiss(delay = 5000) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), delay);
    return () => clearTimeout(t);
  }, [message, delay]);

  return [message, setMessage] as const;
}
