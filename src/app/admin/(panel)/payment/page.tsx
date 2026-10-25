'use client';

import { useEffect, useState } from 'react';
import { formatRupiah, getApiErrorMessage } from '@/components/admin/doctor/utils';
import PaymentReviewModal from '@/components/admin/payment/payment-review-modal';
import { inputBase, secondaryBtn } from '@/components/admin/styles';
import { STATUS_META } from '@/components/user/booking/status';
import { formatDate, formatTime } from '@/components/user/booking/utils';
import { useGetAdminAppointments } from '@/hooks/useAdminAppointments';
import type { TAdminAppointment, TTransactionStatus } from '@/types/appointment';

const LIMIT = 10;

type StatusFilter = TTransactionStatus | 'all';

const STATUS_OPTIONS = Object.entries(STATUS_META) as [
  TTransactionStatus,
  (typeof STATUS_META)[TTransactionStatus],
][];

const actionLink =
  'inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#1B1B7A] hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

export default function PaymentPage() {
  // Default: transaksi yang perlu diproses admin
  const [status, setStatus] = useState<StatusFilter>('waiting_confirmation');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TAdminAppointment | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const { data, isPending, isError, error, refetch, isFetching } = useGetAdminAppointments({
    status: status === 'all' ? undefined : status,
    page,
    limit: LIMIT,
  });

  const appointments = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(meta?.total_pages ?? 1, 1);

  function handleSuccess(message: string) {
    setNotice(message);
    // Baris yang diproses keluar dari filter; mundur bila halaman ini jadi kosong
    if (status === 'waiting_confirmation' && appointments.length === 1 && page > 1)
      setPage((p) => p - 1);
  }

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1B1B7A]">Verifikasi Pembayaran</h1>
        <p className="mt-1 text-neutral-600">
          Periksa bukti transfer pasien, lalu terima atau tolak reservasinya.
        </p>
      </div>

      <div role="status" aria-live="polite">
        {notice && (
          <p className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-medium text-green-900">
            {notice}
          </p>
        )}
      </div>

      {/* FILTER */}
      <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 md:max-w-sm">
        <label htmlFor="payment-status" className="font-semibold">
          Status
        </label>
        <select
          id="payment-status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusFilter);
            setPage(1);
          }}
          className={`mt-2 ${inputBase} border-neutral-300`}
        >
          <option value="all">Semua</option>
          {STATUS_OPTIONS.map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      {/* TABEL */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        {isPending ? (
          <p role="status" className="p-8 text-center text-neutral-600">
            Memuat data transaksi...
          </p>
        ) : isError ? (
          <div role="alert" className="p-8 text-center">
            <p className="text-red-900">
              {getApiErrorMessage(error, 'Gagal memuat data transaksi.')}
            </p>
            <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
              Coba lagi
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <p className="p-8 text-center text-neutral-600">
            {status === 'waiting_confirmation'
              ? 'Tidak ada pembayaran yang menunggu konfirmasi.'
              : 'Tidak ada transaksi dengan status ini.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              aria-busy={isFetching}
              className={`w-full min-w-220 text-left ${isFetching ? 'opacity-60' : ''}`}
            >
              <caption className="sr-only">Daftar transaksi reservasi</caption>
              <thead className="border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-700">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Pasien</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Dokter</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Jadwal</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Total</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Antrean</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {appointments.map((a) => {
                  const meta = STATUS_META[a.status];
                  const session = a.practice_sessions;
                  return (
                    <tr key={a.id}>
                      <th scope="row" className="px-5 py-4 font-normal">
                        <p className="font-semibold text-neutral-900">
                          {a.patient_profiles.users.full_name}
                        </p>
                        <p className="text-sm text-neutral-600">{a.appointment_code}</p>
                      </th>
                      <td className="px-5 py-4">{a.doctors.full_name}</td>
                      <td className="px-5 py-4">
                        {formatDate(session.session_date)}
                        <br />
                        <span className="text-sm text-neutral-700">
                          {formatTime(session.start_time)}–{formatTime(session.end_time)} WIB
                        </span>
                      </td>
                      <td className="px-5 py-4">{formatRupiah(a.total_amount)}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 tabular-nums">{a.queue_number ?? '-'}</td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" onClick={() => setSelected(a)} className={actionLink}>
                          {a.status === 'waiting_confirmation' ? 'Periksa' : 'Lihat'}
                          <span className="sr-only"> pembayaran {a.appointment_code}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINASI */}
      {meta && meta.total > 0 && (
        <nav
          aria-label="Paginasi daftar transaksi"
          className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <p className="text-neutral-600">
            Halaman {meta.page} dari {totalPages} · {meta.total} transaksi
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

      {selected && (
        <PaymentReviewModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
