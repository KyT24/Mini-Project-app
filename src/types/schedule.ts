// Bentuk data mengikuti response backend (Mini-Project.api/src/features/schedule)

export type TDoctorSchedule = {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0 = Minggu ... 6 = Sabtu
  start_time: string; // "1970-01-01T10:00:00.000Z"
  end_time: string;
  patient_quota: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Jam dikirim dalam format "HH:mm"
export type TScheduleCreate = {
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  patient_quota: number;
  is_active?: boolean;
};

export type TScheduleUpdate = Partial<Omit<TScheduleCreate, 'doctor_id'>>;
