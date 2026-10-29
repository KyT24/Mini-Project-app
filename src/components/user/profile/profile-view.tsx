'use client';

import Link from 'next/link';
import { useGetMyPatient } from '@/hooks/api/use-patient';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { getInitials } from '@/lib/format';
import { card, linkClass, primaryBtn, secondaryBtn } from '@/lib/styles';
import { PasswordSection } from './password-section';
import { ProfileSection } from './profile-section';
import { toProfile } from './profile-utils';
import { ReminderSection } from './reminder-section';
import { StatusScreen } from './status-screen';

// Halaman /profile: muat data pasien, lalu tampilkan 3 kartu (data diri, password, pengingat)
export function ProfileView() {
  const { data, isPending, isError, error, refetch } = useGetMyPatient();
  const profile = data ? toProfile(data.data) : null;

  if (isPending) {
    return (
      <StatusScreen title="Memuat profil...">
        <p role="status" className="mt-3 text-neutral-600">
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
          <p className="mt-3 text-neutral-600">Sesi Anda belum ada atau sudah berakhir.</p>
          <Link href="/login" className={`mt-6 inline-block ${primaryBtn}`}>
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
          <Link href="/" className={`mt-6 inline-block ${secondaryBtn}`}>
            Kembali ke beranda
          </Link>
        </StatusScreen>
      );
    }

    return (
      <StatusScreen title="Profil gagal dimuat">
        <p role="alert" className="mt-3 text-neutral-600">
          {getApiErrorMessage(error, 'Terjadi kesalahan. Silakan coba lagi.')}
        </p>
        <button type="button" onClick={() => refetch()} className={`mt-6 ${primaryBtn}`}>
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
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Profil saya</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/80">
            Perbarui data diri, password, dan pengingat jadwal Anda.
          </p>
        </div>
      </header>

      <div className="relative mx-auto -mt-14 grid max-w-3xl gap-6 px-5 pb-14 md:px-8">
        {/* RINGKASAN AKUN */}
        <section className={`${card} flex items-center gap-5`}>
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

        <ProfileSection profile={profile} />
        <PasswordSection />
        <ReminderSection />

        {/* KELUAR */}
        <p className="text-center text-neutral-600">
          Selesai? {/* TODO: ganti dengan fungsi logout Anda */}
          <Link href="/login" className={linkClass}>
            Keluar dari akun
          </Link>
        </p>
      </div>
    </main>
  );
}
