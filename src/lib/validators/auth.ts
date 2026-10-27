export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Nomor Indonesia: 08xx / +628xx / 628xx, 9-12 digit setelah angka 8
const PHONE_REGEX = /^(\+62|62|0)8\d{8,11}$/;
const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Email wajib diisi';
  if (v.length > 254) return 'Email terlalu panjang';
  if (!EMAIL_REGEX.test(v)) return 'Format email tidak valid';
}

export function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Nama lengkap wajib diisi';
  if (v.length < 3) return 'Nama minimal 3 karakter';
  if (v.length > 100) return 'Nama maksimal 100 karakter';
  if (!NAME_REGEX.test(v)) return 'Nama hanya boleh berisi huruf';
}

export function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Nomor WhatsApp wajib diisi';
  if (!PHONE_REGEX.test(v.replace(/[\s-]/g, '')))
    return 'Nomor tidak valid. Contoh: 081234567890';
}

export function validateLoginPassword(value: string): string | undefined {
  if (!value) return 'Password wajib diisi';
}

export function validateNewPassword(value: string): string | undefined {
  if (!value) return 'Password wajib diisi';
  if (value.length < 8) return 'Password minimal 8 karakter';
  if (value.length > 72) return 'Password maksimal 72 karakter';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    return 'Password harus mengandung huruf dan angka';
}

export function validateConfirmPassword(
  value: string,
  password: string,
): string | undefined {
  if (!value) return 'Konfirmasi password wajib diisi';
  if (value !== password) return 'Password tidak sama';
}

export function validateAgree(value: boolean): string | undefined {
  if (!value) return 'Anda perlu menyetujui syarat dan ketentuan';
}

function compact<T>(errors: FieldErrors<T>): FieldErrors<T> {
  return Object.fromEntries(
    Object.entries(errors).filter(([, msg]) => msg),
  ) as FieldErrors<T>;
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  return compact<LoginValues>({
    email: validateEmail(values.email),
    password: validateLoginPassword(values.password),
  });
}

export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  return compact<RegisterValues>({
    name: validateName(values.name),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    password: validateNewPassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.confirmPassword,
      values.password,
    ),
    agree: validateAgree(values.agree),
  });
}
