import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '@/config/axiosInstance';
import type { TApiSuccessResponse } from '@/types/doctor';
import type {
  TAuthUser,
  TLogin,
  TLoginResponse,
  TRegister,
} from '@/types/auth';

type TMutationCallbacks<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<{ message?: string }>) => void;
};

/** Ambil pesan error dari response backend, atau fallback. */
export const getApiErrorMessage = (
  error: AxiosError<{ message?: string }>,
  fallback: string,
) => error.response?.data?.message || fallback;

// POST /auth/login
export const useLogin = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TLoginResponse>> = {}) => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: TLogin) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TLoginResponse>
      >('/auth/login', body);
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as AxiosError<{ message?: string }>),
  });
};

// POST /auth/register
export const useRegister = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAuthUser>> = {}) => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (body: TRegister) => {
      const { data } = await axiosInstance.post<TApiSuccessResponse<TAuthUser>>(
        '/auth/register',
        body,
      );
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as AxiosError<{ message?: string }>),
  });
};
