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
  TDoctor,
  TDoctorCreate,
  TDoctorIndex,
  TDoctorUpdate,
  TPaginateResponse,
} from '@/types/doctor';

type TMutationCallbacks<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
};

// GET /doctors
export const useGetDoctors = (
  {
    page,
    limit,
    search,
    is_active,
    sort,
    specialist_id,
    min_fee,
    max_fee,
    day_of_week,
  }: TDoctorIndex = {},
  enabled = true,
) => {
  return useQuery<TPaginateResponse<TDoctor>>({
    enabled,
    queryKey: [
      'get-doctors',
      page,
      limit,
      search,
      is_active,
      sort,
      specialist_id,
      min_fee,
      max_fee,
      day_of_week,
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/doctors', {
        params: {
          page,
          limit,
          search: search || undefined,
          is_active,
          sort,
          specialist_id: specialist_id || undefined,
          min_fee,
          max_fee,
          day_of_week,
        },
      });
      return data;
    },
  });
};

// GET /doctors/:id
export const useGetDetailDoctor = (id?: string) => {
  return useQuery<TApiSuccessResponse<TDoctor>>({
    enabled: !!id,
    queryKey: ['get-detail-doctor', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/doctors/${id}`);
      return data;
    },
  });
};

// POST /doctors
export const useCreateDoctor = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TDoctor>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-doctor'],
    mutationFn: async (body: TDoctorCreate) => {
      const { data } = await axiosInstance.post<TApiSuccessResponse<TDoctor>>(
        '/doctors',
        body,
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-doctors'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};

// PATCH /doctors/:id
export const useUpdateDoctor = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TDoctor>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-doctor'],
    mutationFn: async ({ id, body }: { id: string; body: TDoctorUpdate }) => {
      const { data } = await axiosInstance.patch<TApiSuccessResponse<TDoctor>>(
        `/doctors/${id}`,
        body,
      );
      return data;
    },
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['get-doctors'] });
      queryClient.invalidateQueries({ queryKey: ['get-detail-doctor', id] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};

// POST /doctors/photo (multipart, field "photo") — mengembalikan URL foto
export const useUploadDoctorPhoto = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<{ url: string }>> = {}) => {
  return useMutation({
    mutationKey: ['upload-doctor-photo'],
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('photo', file);
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<{ url: string }>
      >('/doctors/photo', form);
      return data;
    },
    onSuccess: (response) => onSuccess?.(response),
    onError: (error) => onError?.(error as AxiosError),
  });
};

// DELETE /doctors/:id
export const useDeleteDoctor = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-doctor'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<
        TApiSuccessResponse<Record<string, never>>
      >(`/doctors/${id}`);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-doctors'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};
