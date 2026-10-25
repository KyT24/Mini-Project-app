'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatRupiah, getApiErrorMessage, getApiStatus } from '@/components/admin/doctor/utils';
import { useGetAppointment, useUploadPaymentProof } from '@/hooks/useAppointments';
import type { TAppointment } from '@/types/appointment';
import { card, errorText, primaryBtn, secondaryBtn } from './styles';
import { formatCountdown, formatDate, formatTime } from './utils';

// TODO: ganti dengan rekening asli klinik
const BANK_ACCOUNT = { bank: 'BCA', number: 'xxxxxxxxxx', holder: 'IH Beauty Clinic' };

const MAX_FILE_SIZE = 2 * 1024 * 1024; // sama dengan backend
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type Props = { appointmentId: string };

// Hitung mundur dari sisa detik yang dikirim server (tidak bergantung jam perangkat)
function useCountdown(appointment?: TAppointment, fetchedAt?: number) {
  const [now, setNow] = useState(() => Date.now());
  const active = appointment?.payment_status === 'unpaid';

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);

  if (!appointment || !fetchedAt || !active) return 0;
  const deadline = fetchedAt + appointment.remaining_seconds * 1000;
  return Math.max(Math.ceil((deadline - now) / 1000), 0);
}

export default function PaymentUpload({ appointmentId }: Props) {
  const { data, dataUpdatedAt, isPending, isError, error, refetch } =
    useGetAppointment(appointmentId);
  const appointment = data?.data;
  const remaining = useCountdown(appointment, dataUpdatedAt);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [serverError, setServerError] = useState('');
  const [expiredByServer, setExpiredByServer] = useState(false);

  // Lepas object URL lama saat pratinjau diganti / komponen ditutup
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function selectFile(selected: File | null) {
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : '');
  }

  const upload = useUploadPaymentProof({
    onError: (err) => {
      const status = getApiStatus(err);
      if (status === 410) {
        setExpiredByServer(true);
        refetch();
      } else if (status === 413) setFileError('Ukuran file maksimal 2 MB.');
      else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
      else setServerError(getApiErrorMessage(err, 'Gagal mengunggah bukti pembayaran.'));
    },
  });

  if (isPending)
    return (
      <p role="status" className={`${card} text-center text-neutral-600`}>
        Memuat data reservasi...
      </p>
    );

  if (isError || !appointment)
    return (
      <div role="alert" className={`${card} text-center`}>
        <p className="text-red-900">
          {getApiStatus(error) === 404
            ? 'Reservasi tidak ditemukan.'
            : getApiErrorMessage(error, 'Gagal memuat data reservasi.')}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          {getApiStatus(error) !== 404 && (
            <button type="button" onClick={() => refetch()} className={primaryBtn}>
              Coba lagi
            </button>
          )}
          <Link href="/" className={secondaryBtn}>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );

  const session = appointment.practice_sessions;
  const bookingHref = `/treatment/${appointment.treatments.slug}/booking`;
  const isExpired =
    expiredByServer ||
    appointment.payment_status === 'expired' ||
    (appointment.payment_status === 'unpaid' && remaining === 0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setServerError('');
    const selected = e.target.files?.[0] ?? null;
    if (selected && !ALLOWED_TYPES.includes(selected.type)) {
      selectFile(null);
      setFileError('File harus berupa gambar JPG, PNG, atau WEBP.');
      return;
    }
    if (selected && selected.size > MAX_FILE_SIZE) {
      selectFile(null);
      setFileError('Ukuran file maksimal 2 MB.');
      return;
    }
    setFileError('');
    selectFile(selected);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!file) {
      setFileError('Pilih foto bukti pembayaran terlebih dahulu.');
      return;
    }
    upload.mutate({ id: appointment!.id, file });
  }

  const summary = (
    <dl className="grid gap-3 sm:grid-cols-2">
      <div>
        <dt className="text-sm text-neutral-600">Kode reservasi</dt>
        <dd className="font-semibold">{appointment.appointment_code}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-600">Treatment</dt>
        <dd className="font-semibold">{appointment.treatments.name}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-600">Dokter</dt>
        <dd className="font-semibold">{appointment.doctors.full_name}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-600">Jadwal</dt>
        <dd className="font-semibold">
          {formatDate(session.session_date)}, {formatTime(session.start_time)}–
          {formatTime(session.end_time)} WIB
        </dd>
      </div>
      <div className="border-t border-neutral-200 pt-3 sm:col-span-2">
        <dt className="text-sm text-neutral-600">Total pembayaran</dt>
        <dd className="text-2xl font-bold text-[#1B1B7A]">
          {formatRupiah(appointment.total_amount)}
        </dd>
        <dd className="text-sm text-neutral-600">
          Konsultasi {formatRupiah(appointment.consultation_fee)} + treatment{' '}
          {formatRupiah(appointment.treatment_fee)}
        </dd>
      </div>
    </dl>
  );

  if (isExpired || appointment.payment_status === 'rejected')
    return (
      <div className="grid gap-6">
        <div role="alert" className={`${card} border-amber-300 bg-amber-50 text-amber-950`}>
          <h2 className="text-2xl font-bold tracking-tight">
            {appointment.payment_status === 'rejected'
              ? 'Pembayaran ditolak'
              : 'Waktu pembayaran habis'}
          </h2>
          <p className="mt-2">
            {appointment.payment_status === 'rejected'
              ? 'Bukti pembayaran Anda ditolak oleh klinik. Silakan buat reservasi baru.'
              : 'Bukti pembayaran tidak diunggah dalam 10 menit, sehingga kuota dokter telah dilepas. Silakan isi ulang form reservasi.'}
          </p>
          <Link href={`${bookingHref}?expired=1`} className={`mt-5 ${primaryBtn}`}>
            Isi ulang form reservasi
          </Link>
        </div>
        <section className={card} aria-label="Ringkasan reservasi">
          {summary}
        </section>
      </div>
    );

  if (appointment.payment_status !== 'unpaid')
    return (
      <div className="grid gap-6">
        <div role="status" className={`${card} border-green-300 bg-green-50 text-green-950`}>
          <h2 className="text-2xl font-bold tracking-tight">
            {appointment.payment_status === 'paid'
              ? 'Pembayaran terverifikasi'
              : 'Bukti pembayaran terkirim'}
          </h2>
          <p className="mt-2">
            {appointment.payment_status === 'paid'
              ? 'Reservasi Anda sudah dikonfirmasi. Sampai jumpa di klinik!'
              : 'Kuota Anda sudah aman. Klinik akan memverifikasi pembayaran Anda secepatnya.'}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/history" className={primaryBtn}>
              Lihat riwayat reservasi
            </Link>
            <Link href="/" className={secondaryBtn}>
              Kembali ke beranda
            </Link>
          </div>
        </div>
        <section className={card} aria-label="Ringkasan reservasi">
          {summary}
        </section>
      </div>
    );

  const isUrgent = remaining <= 60;

  return (
    <div className="grid gap-6">
      <div
        className={`flex flex-col gap-2 rounded-3xl border p-6 sm:flex-row sm:items-center sm:justify-between md:p-8 ${
          isUrgent ? 'border-red-300 bg-red-50 text-red-950' : 'border-[#1B1B7A]/20 bg-[#1B1B7A]/5'
        }`}
      >
        <div>
          <p className="font-semibold">Sisa waktu unggah bukti pembayaran</p>
          <p className="text-sm">Lewat dari batas ini, kuota dokter akan dilepas.</p>
          <p className="mt-1 text-sm">
            Keluar dari halaman ini? Buka lagi lewat{' '}
            <Link
              href="/history"
              className="font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
            >
              Riwayat reservasi
            </Link>
            .
          </p>
        </div>
        {/* aria-live off: angka berubah tiap detik, terlalu ramai untuk screen reader */}
        <p
          role="timer"
          aria-live="off"
          aria-label={`Sisa waktu ${Math.floor(remaining / 60)} menit ${remaining % 60} detik`}
          className="text-4xl font-bold tabular-nums tracking-tight"
        >
          {formatCountdown(remaining)}
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {remaining === 60 ? 'Sisa waktu 1 menit.' : ''}
      </p>

      <section className={card} aria-label="Ringkasan reservasi">
        {summary}
        <div className="mt-6 rounded-2xl bg-[#FAF8F3] px-4 py-3">
          <p className="text-sm text-neutral-600">Transfer ke rekening</p>
          <p className="font-semibold">
            {BANK_ACCOUNT.bank} {BANK_ACCOUNT.number} a.n. {BANK_ACCOUNT.holder}
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} noValidate className={card}>
        {serverError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
          >
            {serverError}
          </div>
        )}

        <label htmlFor="payment-proof" className="font-semibold">
          Bukti pembayaran
        </label>
        <p id="payment-proof-hint" className="mt-1 text-sm text-neutral-600">
          Foto atau tangkapan layar struk transfer. JPG, PNG, atau WEBP, maksimal 2 MB.
        </p>
        <input
          id="payment-proof"
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          aria-invalid={!!fileError}
          aria-describedby={`payment-proof-hint${fileError ? ' payment-proof-error' : ''}`}
          onChange={handleFileChange}
          disabled={upload.isPending}
          className="mt-3 block w-full rounded-xl border border-neutral-300 bg-white text-neutral-900 file:mr-4 file:min-h-11 file:cursor-pointer file:border-0 file:bg-[#1B1B7A] file:px-4 file:font-semibold file:text-white hover:file:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
        />
        {fileError && (
          <p id="payment-proof-error" role="alert" className={errorText}>
            {fileError}
          </p>
        )}

        {preview && (
          <img
            src={preview}
            alt="Pratinjau bukti pembayaran"
            className="mt-4 max-h-80 rounded-2xl border border-neutral-200 object-contain"
          />
        )}

        <button type="submit" disabled={upload.isPending} className={`mt-6 w-full sm:w-auto ${primaryBtn}`}>
          {upload.isPending ? 'Mengunggah...' : 'Kirim bukti pembayaran'}
        </button>
      </form>
    </div>
  );
}
