import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '@/config/axiosInstance';
import type {
  TApiError,
  TApiSuccessResponse,
  TMutationCallbacks,
  TPaginateResponse,
} from '@/types/api';
import type {
  TAppointment,
  TAppointmentCreate,
  TAvailability,
  TRatingCreate,
} from '@/types/appointment';

// GET /appointments/availability — kuota tiap jadwal dokter di satu tanggal
export const useGetAvailability = (doctorId?: string, date?: string) => {
  return useQuery<TApiSuccessResponse<TAvailability>>({
    enabled: !!doctorId && !!date,
    queryKey: ['get-availability', doctorId, date],
    // Kuota berubah cepat karena pasien lain ikut memesan
    staleTime: 0,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/appointments/availability', {
        params: { doctor_id: doctorId, date },
      });
      return data;
    },
  });
};

// GET /appointments/me — riwayat reservasi pasien yang login
export const useGetMyAppointments = ({ page = 1, limit = 10 } = {}, enabled = true) => {
  return useQuery<TPaginateResponse<TAppointment>>({
    enabled,
    queryKey: ['get-my-appointments', page, limit],
    placeholderData: keepPreviousData,
    // Status pembayaran & sisa waktu berubah cepat
    staleTime: 0,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/appointments/me', {
        params: { page, limit },
      });
      return data;
    },
  });
};

// GET /appointments/:id
export const useGetAppointment = (id?: string) => {
  return useQuery<TApiSuccessResponse<TAppointment>>({
    enabled: !!id,
    queryKey: ['get-appointment', id],
    staleTime: 0,
    retry: false,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/appointments/${id}`);
      return data;
    },
  });
};

// POST /appointments — menahan 1 kuota selama 30 menit
export const useCreateAppointment = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-appointment'],
    mutationFn: async (body: TAppointmentCreate) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TAppointment>
      >('/appointments', body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['get-availability'] });
      queryClient.invalidateQueries({ queryKey: ['get-my-appointments'] });
      queryClient.setQueryData(['get-appointment', response.data.id], response);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

// POST /appointments/:id/payment-proof (multipart, field "image")
export const useUploadPaymentProof = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['upload-payment-proof'],
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const form = new FormData();
      form.append('image', file);
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TAppointment>
      >(`/appointments/${id}/payment-proof`, form);
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['get-appointment', response.data.id], response);
      queryClient.invalidateQueries({ queryKey: ['get-my-appointments'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

// PATCH /appointments/:id/cancel — kuota dilepas, antrean di belakangnya maju
export const useCancelAppointment = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['cancel-appointment'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<TAppointment>
      >(`/appointments/${id}/cancel`);
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['get-appointment', response.data.id], response);
      queryClient.invalidateQueries({ queryKey: ['get-my-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['get-availability'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

// POST /appointments/:id/rating — hanya setelah janji temu selesai
export const useRateAppointment = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TAppointment>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['rate-appointment'],
    mutationFn: async ({ id, body }: { id: string; body: TRatingCreate }) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TAppointment>
      >(`/appointments/${id}/rating`, body);
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['get-appointment', response.data.id], response);
      queryClient.invalidateQueries({ queryKey: ['get-my-appointments'] });
      queryClient.invalidateQueries({
        queryKey: ['get-detail-doctor', response.data.doctors.id],
      });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};
