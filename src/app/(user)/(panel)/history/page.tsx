'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { formatRupiah, getApiErrorMessage } from '@/components/admin/doctor/utils';
import RequirePatient from '@/components/user/booking/require-patient';
import { card, primaryBtn, secondaryBtn } from '@/components/user/booking/styles';
import { formatCountdown, formatDate, formatTime } from '@/components/user/booking/utils';
import { useGetMyAppointments } from '@/hooks/useAppointments';
import type { TAppointment } from '@/types/appointment';

const LIMIT = 10;

type Status = { label: string; className: string };

// Satu label yang mudah dipahami pasien dari status pembayaran + status janji temu
function getStatus(appointment: TAppointment, remaining: number): Status {
  const { payment_status, appointment_status } = appointment;

  if (payment_status === 'unpaid' && remaining > 0)
    return { label: 'Menunggu pembayaran', className: 'bg-amber-100 text-amber-950' };
  if (payment_status === 'unpaid' || payment_status === 'expired')
    return { label: 'Waktu bayar habis', className: 'bg-neutral-200 text-neutral-800' };
  if (payment_status === 'rejected')
    return { label: 'Pembayaran ditolak', className: 'bg-red-100 text-red-900' };
  if (payment_status === 'pending_verification')
    return { label: 'Menunggu verifikasi', className: 'bg-blue-100 text-blue-900' };

  if (appointment_status === 'completed')
    return { label: 'Selesai', className: 'bg-green-100 text-green-900' };
  if (appointment_status === 'canceled')
    return { label: 'Dibatalkan', className: 'bg-neutral-200 text-neutral-800' };
  if (appointment_status === 'no_show')
    return { label: 'Tidak hadir', className: 'bg-neutral-200 text-neutral-800' };
  return { label: 'Terkonfirmasi', className: 'bg-green-100 text-green-900' };
}

// Sisa waktu bayar dihitung dari remaining_seconds server, berdetik selama masih ada
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);

  return now;
}

function AppointmentList() {
  const [page, setPage] = useState(1);
  const { data, dataUpdatedAt, isPending, isError, error, refetch, isFetching } =
    useGetMyAppointments({ page, limit: LIMIT });

  const appointments = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(meta?.total_pages ?? 1, 1);

  const hasActiveHold = appointments.some(
    (a) => a.payment_status === 'unpaid' && a.remaining_seconds > 0,
  );
  const now = useNow(hasActiveHold);
  const remainingOf = (a: TAppointment) =>
    a.payment_status === 'unpaid'
      ? Math.max(Math.ceil((dataUpdatedAt + a.remaining_seconds * 1000 - now) / 1000), 0)
      : 0;

  if (isPending)
    return (
      <ul aria-busy="true" aria-label="Memuat riwayat reservasi" className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="h-40 animate-pulse rounded-3xl bg-neutral-200 motion-reduce:animate-none"
          />
        ))}
      </ul>
    );

  if (isError)
    return (
      <div role="alert" className={card}>
        <p className="text-red-900">
          {getApiErrorMessage(error, 'Riwayat reservasi gagal dimuat.')}
        </p>
        <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );

  if (appointments.length === 0)
    return (
      <section className={`${card} text-center`}>
        <h2 className="text-xl font-bold text-[#1B1B7A]">Belum ada reservasi</h2>
        <p className="mx-auto mt-2 max-w-md text-neutral-600">
          Reservasi yang Anda buat akan muncul di sini, termasuk yang belum dibayar.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/treatment" className={primaryBtn}>
            Lihat treatment
          </Link>
          <Link href="/doctor" className={secondaryBtn}>
            Lihat dokter
          </Link>
        </div>
      </section>
    );

  return (
    <>
      <ul
        aria-busy={isFetching}
        className={`grid gap-4 ${isFetching ? 'opacity-60' : ''}`}
      >
        {appointments.map((a) => {
          const remaining = remainingOf(a);
          const waiting = a.payment_status === 'unpaid' && remaining > 0;
          const status = getStatus(a, remaining);
          const session = a.practice_sessions;

          return (
            <li key={a.id}>
              <article
                aria-labelledby={`appointment-${a.id}`}
                className={`rounded-3xl border bg-white p-5 md:p-6 ${
                  waiting ? 'border-amber-400' : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 id={`appointment-${a.id}`} className="text-lg font-bold text-[#1B1B7A]">
                      {a.treatments.name}
                    </h2>
                    <p className="text-sm text-neutral-600">{a.appointment_code}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3 sm:text-base">
                  <div>
                    <dt className="text-neutral-600">Dokter</dt>
                    <dd className="font-semibold">{a.doctors.full_name}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-600">Jadwal</dt>
                    <dd className="font-semibold">
                      {formatDate(session.session_date)}, {formatTime(session.start_time)}–
                      {formatTime(session.end_time)} WIB
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-600">Total</dt>
                    <dd className="font-semibold">{formatRupiah(a.total_amount)}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {waiting ? (
                    <p className="font-semibold text-amber-950">
                      Sisa waktu unggah bukti:{' '}
                      <span className="tabular-nums">{formatCountdown(remaining)}</span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/payment/${a.id}`}
                    className={waiting ? primaryBtn : secondaryBtn}
                  >
                    {waiting ? 'Lanjutkan pembayaran' : 'Lihat detail'}
                    <span className="sr-only"> reservasi {a.appointment_code}</span>
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {meta && meta.total > LIMIT && (
        <nav
          aria-label="Paginasi riwayat reservasi"
          className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <p className="text-neutral-600">
            Halaman {meta.page} dari {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className={secondaryBtn}
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || isFetching}
              className={secondaryBtn}
            >
              Berikutnya
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

export default function HistoryPage() {
  return (
    <main id="main" className="min-h-[60vh] bg-neutral-100 text-neutral-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1B1B7A] md:text-4xl">
          Riwayat reservasi
        </h1>
        <p className="mt-2 text-neutral-600">
          Lanjutkan pembayaran yang belum selesai atau lihat detail reservasi Anda.
        </p>

        <div className="mt-8">
          {/* RequirePatient membaca usePathname, dibungkus Suspense (cacheComponents) */}
          <Suspense>
            <RequirePatient>
              <AppointmentList />
            </RequirePatient>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
