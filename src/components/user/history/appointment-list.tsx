'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getTotalPages, Pagination } from '@/components/ui/pagination';
import { useGetMyAppointments } from '@/hooks/api/use-appointments';
import { useNow } from '@/hooks/use-now';
import { getApiErrorMessage } from '@/lib/api-error';
import { getRemainingSeconds } from '@/lib/appointment';
import { card, primaryBtn, secondaryBtn } from '@/lib/styles';
import { AppointmentCard } from './appointment-card';

const PAGE_SIZE = 10;

// Daftar reservasi pasien yang login: memuat / gagal / kosong / daftar kartu
export function AppointmentList() {
  const [page, setPage] = useState(1);
  const { data, dataUpdatedAt, isPending, isError, error, refetch, isFetching } =
    useGetMyAppointments({ page, limit: PAGE_SIZE });

  const appointments = data?.data ?? [];
  const meta = data?.meta;

  // Jam hanya berdetik bila ada reservasi yang masih menunggu pembayaran
  const hasActiveHold = appointments.some(
    (a) => a.status === 'waiting_payment' && a.remaining_seconds > 0,
  );
  const now = useNow(hasActiveHold);

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
      <ul aria-busy={isFetching} className={`grid gap-4 ${isFetching ? 'opacity-60' : ''}`}>
        {appointments.map((a) => (
          <li key={a.id}>
            <AppointmentCard
              appointment={a}
              remaining={
                a.status === 'waiting_payment'
                  ? getRemainingSeconds(a.remaining_seconds, dataUpdatedAt, now)
                  : 0
              }
            />
          </li>
        ))}
      </ul>

      {meta && meta.total > PAGE_SIZE && (
        <Pagination
          label="Paginasi riwayat reservasi"
          className="mt-6"
          page={meta.page}
          totalPages={getTotalPages(meta)}
          disabled={isFetching}
          onPageChange={setPage}
          buttonClassName={secondaryBtn}
        />
      )}
    </>
  );
}
