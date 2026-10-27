// Bentuk data mengikuti response backend (Mini-Project.api/src/features/specialist)
import type { TApiSuccessResponse, TPaginateResponse } from '@/types/doctor';

export type { TApiSuccessResponse, TPaginateResponse };

export type TSpecialist = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count: { doctors: number };
};

export type TSpecialistIndex = {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
};

export type TSpecialistCreate = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type TSpecialistUpdate = Partial<TSpecialistCreate>;
