import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/config/axiosInstance';
import type {
  TApiError,
  TApiSuccessResponse,
  TMutationCallbacks,
} from '@/types/api';
import type { TPatient, TPatientUpdate } from '@/types/patient';

// GET /patients/me
export const useGetMyPatient = () => {
  return useQuery<TApiSuccessResponse<TPatient>>({
    queryKey: ['get-my-patient'],
    retry: false,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/patients/me');
      return data;
    },
  });
};

// PATCH /patients/me
export const useUpdateMyPatient = ({
  onError,
  onSuccess,
}: TMutationCallbacks<TApiSuccessResponse<TPatient>> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-my-patient'],
    mutationFn: async (body: TPatientUpdate) => {
      const { data } = await axiosInstance.patch<TApiSuccessResponse<TPatient>>(
        '/patients/me',
        body,
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['get-my-patient'], response);
      // nama/email di navbar ikut diperbarui
      queryClient.invalidateQueries({ queryKey: ['me'] });
      onSuccess?.(response);
    },
    onError: (error) => onError?.(error as TApiError),
  });
};
