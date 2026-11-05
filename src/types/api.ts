import type { AxiosError } from 'axios';

// Bentuk respons sukses backend: { success, message, data }
export type TApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type TPaginateMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type TPaginateResponse<T> = TApiSuccessResponse<T[]> & {
  meta: TPaginateMeta;
};

export type TApiError = AxiosError<{ message?: string }>;

// Callback opsional untuk hook mutation
export type TMutationCallbacks<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: TApiError) => void;
};
