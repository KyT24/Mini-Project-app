import type { AxiosError } from 'axios';

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

export function formatRupiah(value: string | number) {
  const n = Number(value);
  if (Number.isNaN(n)) return '-';
  return n.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
}

// Ambil pesan dari response backend { success, message, data }
export function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError?.response) return 'Tidak dapat terhubung ke server.';
  return axiosError.response.data?.message || fallback;
}

export function getApiStatus(error: unknown) {
  return (error as AxiosError)?.response?.status;
}
