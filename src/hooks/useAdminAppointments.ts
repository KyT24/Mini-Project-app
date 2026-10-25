import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '@/config/axiosInstance';
import type { TAdminAppointment, TTransactionStatus } from '@/types/appointment';
import type { TApiSuccessResponse, TPaginateResponse } from '@/types/doctor';

type TMutationCallbacks<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
};

type TAdminAppointmentIndex = {
  status?: TTransactionStatus;
  page?: number;
  limit?: number;
};

// GET /admin/appointments — daftar transaksi untuk verifikasi (ADMIN)
export const useGetAdminAppointments = ({
  status,
  page = 1,
  limit = 10,
}: TAdminAppointmentIndex = {}) => {
  return useQuery<TPaginateResponse<TAdminAppointment>>({
    queryKey: ['get-admin-appointments', status, page, limit],
    placeholderData: keepPreviousData,
    // Status berubah otomatis (expired / dibatalkan) di backend
    staleTime: 0,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/appointments', {
        params: { status, page, limit },
      });
      return data;
    },
  });
};

// PATCH /admin/appointments/:id/approve — status done, nomor antrean & QR dibuat
export const useApproveAppointment = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAdminAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['approve-appointment'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<TAdminAppointment>
      >(`/admin/appointments/${id}/approve`);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-admin-appointments'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};

// PATCH /admin/appointments/:id/reject — body { reason }
export const useRejectAppointment = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAdminAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['reject-appointment'],
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<TAdminAppointment>
      >(`/admin/appointments/${id}/reject`, { reason });
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-admin-appointments'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as AxiosError),
  });
};
