import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '@/config/axiosInstance';
import type {
  TApiError,
  TApiSuccessResponse,
  TMutationCallbacks,
} from '@/types/api';
import type {
  TDoctorSchedule,
  TScheduleCreate,
  TScheduleUpdate,
} from '@/types/schedule';

// Jadwal tampil di daftar & profil dokter, jadi data dokter ikut dimuat ulang
function invalidateSchedules(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['get-schedules'] });
  queryClient.invalidateQueries({ queryKey: ['get-doctors'] });
  queryClient.invalidateQueries({ queryKey: ['get-detail-doctor'] });
}

// GET /schedules?doctor_id= — semua jadwal (aktif & nonaktif)
export const useGetSchedules = (doctorId?: string) => {
  return useQuery<TApiSuccessResponse<TDoctorSchedule[]>>({
    enabled: Boolean(doctorId),
    queryKey: ['get-schedules', doctorId],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/schedules', {
        params: { doctor_id: doctorId },
      });
      return data;
    },
  });
};

// POST /schedules
export const useCreateSchedule = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TDoctorSchedule>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-schedule'],
    mutationFn: async (body: TScheduleCreate) => {
      const { data } = await axiosInstance.post<
        TApiSuccessResponse<TDoctorSchedule>
      >('/schedules', body);
      return data;
    },
    onSuccess: (response) => {
      invalidateSchedules(queryClient);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

// PATCH /schedules/:id
export const useUpdateSchedule = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TDoctorSchedule>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-schedule'],
    mutationFn: async ({ id, body }: { id: string; body: TScheduleUpdate }) => {
      const { data } = await axiosInstance.patch<
        TApiSuccessResponse<TDoctorSchedule>
      >(`/schedules/${id}`, body);
      return data;
    },
    onSuccess: (response) => {
      invalidateSchedules(queryClient);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};

// DELETE /schedules/:id
export const useDeleteSchedule = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<Record<string, never>>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-schedule'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<
        TApiSuccessResponse<Record<string, never>>
      >(`/schedules/${id}`);
      return data;
    },
    onSuccess: (response) => {
      invalidateSchedules(queryClient);
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};
