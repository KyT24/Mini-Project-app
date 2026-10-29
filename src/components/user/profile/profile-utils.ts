import type { TGender, TPatient } from '@/types/patient';

// Bentuk data di form profil (nama field versi frontend)
export type Profile = {
  name: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  gender: TGender | '';
  address: string;
};

export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export const GENDER_LABEL: Record<TGender, string> = {
  female: 'Perempuan',
  male: 'Laki-laki',
  other: 'Lainnya',
};

// Ubah response backend ke bentuk form
export function toProfile(p: TPatient): Profile {
  return {
    name: p.full_name,
    email: p.email,
    phone: p.phone_number,
    birthDate: p.patient_profiles?.date_of_birth?.slice(0, 10) ?? '',
    gender: p.patient_profiles?.gender ?? '',
    address: p.patient_profiles?.address ?? '',
  };
}

/** "1995-08-17" → "17 Agustus 1995"; kosong / tidak valid → "-" */
export function formatBirthDate(value: string) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function validateProfile(p: Profile): ProfileErrors {
  const e: ProfileErrors = {};
  if (!p.name.trim()) e.name = 'Nama lengkap wajib diisi';

  if (!p.email.trim()) e.email = 'Email wajib diisi';
  else if (!/^\S+@\S+\.\S+$/.test(p.email)) e.email = 'Format email tidak valid';

  if (!p.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi';
  else if (!/^(\+62|62|0)8\d{8,11}$/.test(p.phone.replace(/[\s-]/g, '')))
    e.phone = 'Nomor tidak valid. Contoh: 081234567890';

  if (p.birthDate && new Date(p.birthDate) > new Date())
    e.birthDate = 'Tanggal lahir tidak boleh di masa depan';

  return e;
}
