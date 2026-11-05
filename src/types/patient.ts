// Bentuk data mengikuti response backend (Mini-Project.api/src/features/patient)

export type TGender = 'male' | 'female' | 'other';

export type TPatientProfile = {
  id: string;
  date_of_birth: string | null; // ISO string, mis. "1995-08-17T00:00:00.000Z"
  gender: TGender | null;
  address: string | null;
};

export type TPatient = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'PATIENT';
  profile_picture: string | null;
  patient_profiles: TPatientProfile | null; // null bila belum pernah diisi
};

export type TPatientUpdate = {
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string | null; // YYYY-MM-DD
  gender?: TGender | null;
  address?: string | null;
};
