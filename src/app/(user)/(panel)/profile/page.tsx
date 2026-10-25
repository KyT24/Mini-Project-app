'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/components/admin/doctor/utils';
import { useGetMyPatient, useUpdateMyPatient } from '@/hooks/usePatient';
import type { TGender, TPatient } from '@/types/patient';

type Profile = {
  name: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  gender: TGender | '';
  address: string;
};

type ProfileErrors = Partial<Record<keyof Profile, string>>;

type PasswordErrors = {
  current?: string;
  next?: string;
  confirm?: string;
};

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

const primaryBtn =
  'rounded-2xl bg-[#1B1B7A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500';

const secondaryBtn =
  'rounded-2xl border border-neutral-300 bg-white px-6 py-3 font-bold text-[#1B1B7A] transition-colors hover:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:text-neutral-500';

const toggleBtn =
  'absolute inset-y-0 right-0 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

const linkClass =
  'font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

const EMPTY_PROFILE: Profile = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: '',
};

const GENDER_LABEL: Record<TGender, string> = {
  female: 'Perempuan',
  male: 'Laki-laki',
  other: 'Lainnya',
};

// Ubah response backend ke bentuk form
function toProfile(p: TPatient): Profile {
  return {
    name: p.full_name,
    email: p.email,
    phone: p.phone_number,
    birthDate: p.patient_profiles?.date_of_birth?.slice(0, 10) ?? '',
    gender: p.patient_profiles?.gender ?? '',
    address: p.patient_profiles?.address ?? '',
  };
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  );
}

function formatDate(value: string) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function validateProfile(p: Profile): ProfileErrors {
  const e: ProfileErrors = {};
  if (!p.name.trim()) e.name = 'Nama lengkap wajib diisi';

  if (!p.email.trim()) e.email = 'Email wajib diisi';
  else if (!/^\S+@\S+\.\S+$/.test(p.email))
    e.email = 'Format email tidak valid';

  if (!p.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi';
  else if (!/^(\+62|62|0)8\d{8,11}$/.test(p.phone.replace(/[\s-]/g, '')))
    e.phone = 'Nomor tidak valid. Contoh: 081234567890';

  if (p.birthDate && new Date(p.birthDate) > new Date())
    e.birthDate = 'Tanggal lahir tidak boleh di masa depan';

  return e;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-semibold"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} pr-28 ${error ? 'border-red-600' : 'border-neutral-300'}`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-pressed={show}
        className={toggleBtn}
      >
        {show ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    </div>
  );
}

function StatusScreen({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 text-neutral-900">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-center md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  // ---- Data diri (dari backend) ----
  const { data, isPending, isError, error, refetch } = useGetMyPatient();
  const profile = data ? toProfile(data.data) : null;

  const [draft, setDraft] = useState<Profile>(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileStatus, setProfileStatus] = useState('');
  const [profileServerError, setProfileServerError] = useState('');

  const { mutate: updateProfile, isPending: isSavingProfile } =
    useUpdateMyPatient({
      onSuccess: () => {
        setIsEditing(false);
        setProfileStatus('Data diri berhasil disimpan.');
      },
      onError: (err) => {
        const status = getApiStatus(err);
        setProfileServerError(
          status === 409
            ? 'Email atau nomor WhatsApp sudah dipakai akun lain.'
            : getApiErrorMessage(
                err,
                'Data diri gagal disimpan. Silakan coba lagi.',
              ),
        );
      },
    });

  // ---- Password ----
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordServerError, setPasswordServerError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // ---- Preferensi pengingat ----
  const [remindWhatsapp, setRemindWhatsapp] = useState(true);
  const [remindEmail, setRemindEmail] = useState(false);
  const [prefStatus, setPrefStatus] = useState('');
  const [isSavingPref, setIsSavingPref] = useState(false);

  function setField<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function startEdit() {
    if (!profile) return;
    setDraft(profile);
    setProfileErrors({});
    setProfileStatus('');
    setProfileServerError('');
    setIsEditing(true);
  }

  function cancelEdit() {
    setProfileErrors({});
    setProfileServerError('');
    setIsEditing(false);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileServerError('');
    setProfileStatus('');

    const errs = validateProfile(draft);
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Kolom opsional yang dikosongkan dikirim sebagai null
    updateProfile({
      full_name: draft.name.trim(),
      email: draft.email.trim(),
      phone_number: draft.phone.replace(/[\s-]/g, ''),
      date_of_birth: draft.birthDate || null,
      gender: draft.gender || null,
      address: draft.address.trim() || null,
    });
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordServerError('');
    setPasswordStatus('');

    const errs: PasswordErrors = {};
    if (!currentPassword) errs.current = 'Password saat ini wajib diisi';
    if (!newPassword) errs.next = 'Password baru wajib diisi';
    else if (newPassword.length < 8) errs.next = 'Password minimal 8 karakter';
    else if (newPassword === currentPassword)
      errs.next = 'Password baru harus berbeda dari password saat ini';
    if (!confirmPassword) errs.confirm = 'Konfirmasi password wajib diisi';
    else if (confirmPassword !== newPassword)
      errs.confirm = 'Password tidak sama';

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSavingPassword(true);
    try {
      // TODO: panggil API ubah password Anda di sini, contoh:
      // await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setPasswordStatus('Password berhasil diubah.');
    } catch {
      setPasswordServerError(
        'Password gagal diubah. Periksa password saat ini lalu coba lagi.',
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  function cancelPassword() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    setPasswordServerError('');
    setShowPasswordForm(false);
  }

  async function handleSavePreferences(e: React.FormEvent) {
    e.preventDefault();
    setPrefStatus('');
    setIsSavingPref(true);
    try {
      // TODO: panggil API simpan preferensi di sini, contoh:
      // await updatePreferences({ remindWhatsapp, remindEmail });
      setPrefStatus('Preferensi pengingat berhasil disimpan.');
    } finally {
      setIsSavingPref(false);
    }
  }

  const cardClass = 'rounded-3xl border border-neutral-200 bg-white p-6 md:p-8';

  if (isPending) {
    return (
      <StatusScreen title="Memuat profil...">
        <p
          role="status"
          className="mt-3 text-neutral-600"
        >
          Mohon tunggu sebentar.
        </p>
      </StatusScreen>
    );
  }

  if (isError || !profile) {
    const status = getApiStatus(error);

    if (status === 401) {
      return (
        <StatusScreen title="Silakan masuk dulu">
          <p className="mt-3 text-neutral-600">
            Sesi Anda belum ada atau sudah berakhir.
          </p>
          <Link
            href="/login"
            className={`mt-6 inline-block ${primaryBtn}`}
          >
            Masuk
          </Link>
        </StatusScreen>
      );
    }

    if (status === 403) {
      return (
        <StatusScreen title="Halaman khusus pasien">
          <p className="mt-3 text-neutral-600">
            Akun Anda bukan akun pasien, jadi profil pasien tidak tersedia.
          </p>
          <Link
            href="/"
            className={`mt-6 inline-block ${secondaryBtn}`}
          >
            Kembali ke beranda
          </Link>
        </StatusScreen>
      );
    }

    return (
      <StatusScreen title="Profil gagal dimuat">
        <p
          role="alert"
          className="mt-3 text-neutral-600"
        >
          {getApiErrorMessage(error, 'Terjadi kesalahan. Silakan coba lagi.')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className={`mt-6 ${primaryBtn}`}
        >
          Coba lagi
        </button>
      </StatusScreen>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* HEADER BRAND */}
      <header
        className="relative overflow-hidden bg-[#1B1B7A] pb-24 pt-8 text-white md:pt-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 10% 0%, rgba(60,66,190,0.7), transparent 70%), radial-gradient(50% 80% at 95% 100%, rgba(8,10,70,0.9), transparent 70%)',
        }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-4 px-5 md:px-8">
          <Link
            href="/"
            className="rounded-md font-semibold text-white/90 underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ke dashboard
          </Link>
        </div>

        <div className="mx-auto mt-6 max-w-3xl px-5 md:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Profil saya
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/80">
            Perbarui data diri, password, dan pengingat jadwal Anda.
          </p>
        </div>
      </header>

      <div className="relative mx-auto -mt-14 grid max-w-3xl gap-6 px-5 pb-14 md:px-8">
        {/* RINGKASAN AKUN */}
        <section className={`${cardClass} flex items-center gap-5`}>
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1B1B7A] text-xl font-bold text-white ring-4 ring-[#F29A9A]/40"
          >
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold tracking-tight text-[#1B1B7A]">
              {profile.name}
            </p>
            <p className="truncate text-neutral-600">{profile.email}</p>
          </div>
        </section>

        {/* DATA DIRI */}
        <section
          aria-labelledby="data-diri-title"
          className={cardClass}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="data-diri-title"
                className="text-2xl font-bold tracking-tight text-[#1B1B7A]"
              >
                Data diri
              </h2>
              <p className="mt-1 text-neutral-600">
                {isEditing
                  ? 'Ubah data lalu simpan.'
                  : 'Data yang tersimpan di akun Anda.'}
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={startEdit}
                className={secondaryBtn}
              >
                Edit data
              </button>
            )}
          </div>

          {profileStatus && !isEditing && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
            >
              {profileStatus}
            </div>
          )}

          {profileServerError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
            >
              {profileServerError}
            </div>
          )}

          {!isEditing ? (
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-neutral-600">
                  Nama lengkap
                </dt>
                <dd className="mt-1">{profile.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-neutral-600">
                  Email
                </dt>
                <dd className="mt-1 wrap-break-words">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-neutral-600">
                  Nomor WhatsApp
                </dt>
                <dd className="mt-1">{profile.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-neutral-600">
                  Tanggal lahir
                </dt>
                <dd className="mt-1">{formatDate(profile.birthDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-neutral-600">
                  Jenis kelamin
                </dt>
                <dd className="mt-1">
                  {profile.gender ? GENDER_LABEL[profile.gender] : '-'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-neutral-600">
                  Alamat
                </dt>
                <dd className="mt-1">{profile.address || '-'}</dd>
              </div>
            </dl>
          ) : (
            <form
              onSubmit={handleSaveProfile}
              noValidate
              className="mt-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    id="name"
                    label="Nama lengkap"
                    error={profileErrors.name}
                  >
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={draft.name}
                      onChange={(e) => setField('name', e.target.value)}
                      aria-invalid={!!profileErrors.name}
                      aria-describedby={
                        profileErrors.name ? 'name-error' : undefined
                      }
                      className={`${inputBase} ${
                        profileErrors.name
                          ? 'border-red-600'
                          : 'border-neutral-300'
                      }`}
                    />
                  </Field>
                </div>

                <Field
                  id="email"
                  label="Email"
                  error={profileErrors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={draft.email}
                    onChange={(e) => setField('email', e.target.value)}
                    aria-invalid={!!profileErrors.email}
                    aria-describedby={
                      profileErrors.email ? 'email-error' : undefined
                    }
                    className={`${inputBase} ${
                      profileErrors.email
                        ? 'border-red-600'
                        : 'border-neutral-300'
                    }`}
                  />
                </Field>

                <Field
                  id="phone"
                  label="Nomor WhatsApp"
                  error={profileErrors.phone}
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="081234567890"
                    value={draft.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    aria-invalid={!!profileErrors.phone}
                    aria-describedby={
                      profileErrors.phone ? 'phone-error' : undefined
                    }
                    className={`${inputBase} ${
                      profileErrors.phone
                        ? 'border-red-600'
                        : 'border-neutral-300'
                    }`}
                  />
                </Field>

                <Field
                  id="birthDate"
                  label="Tanggal lahir"
                  error={profileErrors.birthDate}
                >
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    autoComplete="bday"
                    value={draft.birthDate}
                    onChange={(e) => setField('birthDate', e.target.value)}
                    aria-invalid={!!profileErrors.birthDate}
                    aria-describedby={
                      profileErrors.birthDate ? 'birthDate-error' : undefined
                    }
                    className={`${inputBase} ${
                      profileErrors.birthDate
                        ? 'border-red-600'
                        : 'border-neutral-300'
                    }`}
                  />
                </Field>

                <Field
                  id="gender"
                  label="Jenis kelamin"
                >
                  <select
                    id="gender"
                    name="gender"
                    value={draft.gender}
                    onChange={(e) =>
                      setField('gender', e.target.value as Profile['gender'])
                    }
                    className={`${inputBase} border-neutral-300`}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    {Object.entries(GENDER_LABEL).map(([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    id="address"
                    label="Alamat"
                  >
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      autoComplete="street-address"
                      placeholder="Alamat lengkap"
                      value={draft.address}
                      onChange={(e) => setField('address', e.target.value)}
                      className={`${inputBase} border-neutral-300`}
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={primaryBtn}
                >
                  {isSavingProfile ? 'Memproses...' : 'Simpan perubahan'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSavingProfile}
                  className={secondaryBtn}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </section>

        {/* PASSWORD */}
        <section
          aria-labelledby="password-title"
          className={cardClass}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="password-title"
                className="text-2xl font-bold tracking-tight text-[#1B1B7A]"
              >
                Password
              </h2>
              <p className="mt-1 text-neutral-600">
                Ganti password secara berkala agar akun tetap aman.
              </p>
            </div>
            {!showPasswordForm && (
              <button
                type="button"
                onClick={() => {
                  setPasswordStatus('');
                  setShowPasswordForm(true);
                }}
                className={secondaryBtn}
              >
                Ubah password
              </button>
            )}
          </div>

          {passwordStatus && !showPasswordForm && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
            >
              {passwordStatus}
            </div>
          )}

          {showPasswordForm && (
            <form
              onSubmit={handleChangePassword}
              noValidate
              className="mt-6"
            >
              {passwordServerError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
                >
                  {passwordServerError}
                </div>
              )}

              <div className="grid gap-5">
                <Field
                  id="currentPassword"
                  label="Password saat ini"
                  error={passwordErrors.current}
                >
                  <PasswordInput
                    id="currentPassword"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    autoComplete="current-password"
                    placeholder="Password saat ini"
                    error={passwordErrors.current}
                  />
                </Field>

                <Field
                  id="newPassword"
                  label="Password baru"
                  error={passwordErrors.next}
                >
                  <PasswordInput
                    id="newPassword"
                    value={newPassword}
                    onChange={setNewPassword}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    error={passwordErrors.next}
                  />
                </Field>

                <Field
                  id="confirmNewPassword"
                  label="Konfirmasi password baru"
                  error={passwordErrors.confirm}
                >
                  <PasswordInput
                    id="confirmNewPassword"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                    placeholder="Ulangi password baru"
                    error={passwordErrors.confirm}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className={primaryBtn}
                >
                  {isSavingPassword ? 'Memproses...' : 'Simpan password'}
                </button>
                <button
                  type="button"
                  onClick={cancelPassword}
                  disabled={isSavingPassword}
                  className={secondaryBtn}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </section>

        {/* PREFERENSI PENGINGAT */}
        <section
          aria-labelledby="pengingat-title"
          className={cardClass}
        >
          <h2
            id="pengingat-title"
            className="text-2xl font-bold tracking-tight text-[#1B1B7A]"
          >
            Pengingat jadwal
          </h2>
          <p className="mt-1 text-neutral-600">
            Pilih cara Anda ingin diingatkan sebelum kunjungan.
          </p>

          <form
            onSubmit={handleSavePreferences}
            className="mt-6"
          >
            <div className="grid gap-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={remindWhatsapp}
                  onChange={(e) => setRemindWhatsapp(e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-300 accent-[#1B1B7A]"
                />
                <span>Kirim pengingat lewat WhatsApp</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={remindEmail}
                  onChange={(e) => setRemindEmail(e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-300 accent-[#1B1B7A]"
                />
                <span>Kirim pengingat lewat email</span>
              </label>
            </div>

            {prefStatus && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
              >
                {prefStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={isSavingPref}
              className={`mt-6 ${primaryBtn}`}
            >
              {isSavingPref ? 'Memproses...' : 'Simpan preferensi'}
            </button>
          </form>
        </section>

        {/* KELUAR */}
        <p className="text-center text-neutral-600">
          Selesai? {/* TODO: ganti dengan fungsi logout Anda */}
          <Link
            href="/login"
            className={linkClass}
          >
            Keluar dari akun
          </Link>
        </p>
      </div>
    </main>
  );
}
