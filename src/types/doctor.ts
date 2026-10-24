// Bentuk data mengikuti response backend (Mini-Project.api/src/features/doctor)

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users: TDoctorUser;
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
};

export type TDoctorCreate = {
  user_id: string;
  full_name: string;
  bio?: string | null;
  experience_years?: number;
  consultation_fee?: number | string;
  photo?: string | null;
  is_active?: boolean;
};

// user_id tidak bisa diubah
export type TDoctorUpdate = Partial<Omit<TDoctorCreate, 'user_id'>>;

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
