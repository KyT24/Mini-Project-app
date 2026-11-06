import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/config/axiosInstance';
import type {
  TApiError,
  TApiSuccessResponse,
  TMutationCallbacks,
} from '@/types/api';
import type {
  TAuthUser,
  TChangePassword,
  TForgotPassword,
  TLogin,
  TLoginResponse,
  TRegister,
  TResetPassword,
} from '@/types/auth';

export const useLogin = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TLoginResponse>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: TLogin) => {
      const { data } = await axiosInstance.post<
       TApiSuccessResponse<TLoginResponse>
      >('/auth/login', body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['me'], response.data.user);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

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
    onError: (error) => onError?.(error as TApiError),
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
    onError: (error) => onError?.(error as TApiError),
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
        if ((error as TApiError).response?.status === 401) return null;
        throw error;
      }
    },
  });
};

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
    onError: (error) => onError?.(error as TApiError),
  });
};

export const useForgotPassword = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (body: TForgotPassword) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<Record<string, never>>
      >('/auth/forgot-password', body);
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as TApiError),
  });
};

export const useResetPassword = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (body: TResetPassword) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<Record<string, never>>
      >('/auth/reset-password', body);
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as TApiError),
  });
};

export const useChangePassword = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: async (body: TChangePassword) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<Record<string, never>>
      >('/auth/password', body);
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as TApiError),
  });
};
