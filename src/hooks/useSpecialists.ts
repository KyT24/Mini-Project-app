import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '@/config/axiosInstance';
import type {
  TApiSuccessResponse,
  TPaginateResponse,
  TSpecialist,
  TSpecialistCreate,
  TSpecialistIndex,
  TSpecialistUpdate,
} from '@/types/specialist';

type TMutationCallbacks<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
};

// GET /specialists
export const useGetSpecialists = (
  { page, limit, search, is_active }: TSpecialistIndex = {},
  enabled = true,
) => {
  return useQuery<TPaginateResponse<TSpecialist>>({
    enabled,
    queryKey: ['get-specialists', page, limit, search, is_active],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/specialists', {
        params: { page, limit, search: search || undefined, is_active },
      });
      return data;
    },
  });
};

// POST /specialists
export const useCreateSpecialist = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TSpecialist>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-specialist'],
    mutationFn: async (body: TSpecialistCreate) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TSpecialist>
      >('/specialists', body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-specialists'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};

// PATCH /specialists/:id
export const useUpdateSpecialist = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TSpecialist>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-specialist'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: TSpecialistUpdate;
    }) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<TSpecialist>
      >(`/specialists/${id}`, body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-specialists'] });
      // Nama spesialis ikut tampil di daftar dokter
      queryClient.invalidateQueries({ queryKey: ['get-doctors'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};

// DELETE /specialists/:id
export const useDeleteSpecialist = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-specialist'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<
        TApiSuccessResponse<Record<string, never>>
      >(`/specialists/${id}`);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-specialists'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};
