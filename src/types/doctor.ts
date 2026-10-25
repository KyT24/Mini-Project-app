// Bentuk data mengikuti response backend (Mini-Project.api/src/features/doctor)
import type { TDoctorSchedule } from './schedule';

export type TDoctorUser = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  profile_picture: string | null;
};

export type TDoctor = {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  experience_years: number;
  consultation_fee: string; // Decimal dari Prisma dikirim sebagai string
  photo: string | null;
  specialist_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users: TDoctorUser;
  specialists: { id: string; name: string } | null;
  // Hanya jadwal aktif, urut hari lalu jam
  doctor_schedules: Pick<
    TDoctorSchedule,
    'id' | 'day_of_week' | 'start_time' | 'end_time' | 'patient_quota'
  >[];
};

export type TDoctorSort =
  | 'newest'
  | 'fee_asc'
  | 'fee_desc'
  | 'experience_desc';

export type TDoctorIndex = {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sort?: TDoctorSort;
  specialist_id?: string;
  min_fee?: number;
  max_fee?: number;
  day_of_week?: number;
};

// Akun login (role DOCTOR) dibuat backend bersamaan dengan profil dokter
export type TDoctorCreate = {
  email: string;
  phone_number: string;
  password: string;
  full_name: string;
  bio?: string | null;
  experience_years?: number;
  consultation_fee?: number | string;
  photo?: string | null;
  specialist_id?: string | null;
  is_active?: boolean;
};

// Data akun tidak diubah lewat form dokter
export type TDoctorUpdate = Partial<
  Omit<TDoctorCreate, 'email' | 'phone_number' | 'password'>
>;

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
