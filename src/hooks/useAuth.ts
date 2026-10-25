import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: TLogin) => {
      console.log(body)
      const { data } = await axiosInstance.post<
       TApiSuccessResponse<TLoginResponse>
      >('/auth/login', body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['me'], response.data.user);
      onSuccess?.(response);
    },
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

// POST /auth/admins — hanya bisa dipanggil admin yang sedang login
export const useRegisterAdmin = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAuthUser>> = {}) => {
  return useMutation({
    mutationKey: ['register-admin'],
    mutationFn: async (body: TRegister) => {
      const { data } = await axiosInstance.post<TApiSuccessResponse<TAuthUser>>(
        '/auth/admins',
        body,
      );
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as AxiosError<{ message?: string }>),
  });
};

// GET /auth/me — null bila belum login / token kedaluwarsa
export const useMe = () => {
  return useQuery<TAuthUser | null>({
    queryKey: ['me'],
    retry: false,
    queryFn: async () => {
      try {
        const { data } =
          await axiosInstance.get<TApiSuccessResponse<TAuthUser>>('/auth/me');
        return data.data;
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) return null;
        throw error;
      }
    },
  });
};

// POST /auth/logout
export const useLogout = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const { data } =
        await axiosInstance.post<TApiSuccessResponse<Record<string, never>>>(
          '/auth/logout',
        );
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['me'], null);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError<{ message?: string }>),
  });
};
