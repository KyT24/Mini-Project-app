import type { AxiosError } from 'axios';

// Ambil pesan dari response backend { success, message, data }
export function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError?.response) return 'Tidak dapat terhubung ke server.';
  return axiosError.response.data?.message || fallback;
}

export function getApiStatus(error: unknown) {
  return (error as AxiosError)?.response?.status;
}
