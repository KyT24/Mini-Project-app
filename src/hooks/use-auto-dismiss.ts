import { useEffect, useState } from 'react';

// Pesan sukses yang hilang sendiri setelah `delay` ms
export function useAutoDismiss(delay = 5000) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), delay);
    return () => clearTimeout(timer);
  }, [message, delay]);

  return [message, setMessage] as const;
}
