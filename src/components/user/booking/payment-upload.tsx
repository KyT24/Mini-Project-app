'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatRupiah, getApiErrorMessage, getApiStatus } from '@/components/admin/doctor/utils';
import { useGetAppointment, useUploadPaymentProof } from '@/hooks/useAppointments';
import type { TAppointment } from '@/types/appointment';
import AppointmentQr from './appointment-qr';
import CancelAppointmentModal from './cancel-appointment-modal';
import RatingForm from './rating-form';
import RatingStars from './rating-stars';
import { STATUS_META } from './status';
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
  const active = appointment?.status === 'waiting_payment';

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
  const [cancelOpen, setCancelOpen] = useState(false);

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
    appointment.status === 'expired' ||
    (appointment.status === 'waiting_payment' && remaining === 0);
  const status = STATUS_META[isExpired ? 'expired' : appointment.status];
  const rejectionReason = appointment.payment_proofs[0]?.rejection_reason;

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
    <section className={card} aria-label="Ringkasan reservasi">
      <span
        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}
      >
        {status.label}
      </span>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
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
        {appointment.queue_number !== null && (
          <div>
            <dt className="text-sm text-neutral-600">Nomor antrean</dt>
            <dd className="font-semibold tabular-nums">{appointment.queue_number}</dd>
          </div>
        )}
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
    </section>
  );

  const cancelButton = appointment.can_cancel && (
    <button type="button" onClick={() => setCancelOpen(true)} className={secondaryBtn}>
      Batalkan booking
    </button>
  );

  const cancelModal = cancelOpen && (
    <CancelAppointmentModal
      appointment={appointment}
      onClose={() => setCancelOpen(false)}
      onStale={() => refetch()}
    />
  );

  if (isExpired || appointment.status === 'rejected')
    return (
      <div className="grid gap-6">
        <div role="alert" className={`${card} border-amber-300 bg-amber-50 text-amber-950`}>
          <h2 className="text-2xl font-bold tracking-tight">
            {appointment.status === 'rejected' ? 'Pembayaran ditolak' : 'Waktu pembayaran habis'}
          </h2>
          <p className="mt-2">
            {appointment.status === 'rejected'
              ? 'Bukti pembayaran Anda ditolak oleh klinik dan kuota sudah dilepas. Silakan buat reservasi baru.'
              : 'Bukti pembayaran tidak diunggah dalam 30 menit, sehingga kuota dokter telah dilepas. Silakan isi ulang form reservasi.'}
          </p>
          {appointment.status === 'rejected' && rejectionReason && (
            <p className="mt-2">
              <strong>Alasan:</strong> {rejectionReason}
            </p>
          )}
          <Link href={`${bookingHref}?expired=1`} className={`mt-5 ${primaryBtn}`}>
            Isi ulang form reservasi
          </Link>
        </div>
        {summary}
      </div>
    );

  if (appointment.status === 'canceled')
    return (
      <div className="grid gap-6">
        <div role="status" className={`${card} bg-neutral-50`}>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Reservasi dibatalkan
          </h2>
          <p className="mt-2 text-neutral-700">
            Kuota sudah dilepas untuk pasien lain. Reservasi juga otomatis dibatalkan bila admin
            belum memproses pembayaran sampai jadwal dimulai.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={bookingHref} className={primaryBtn}>
              Buat reservasi baru
            </Link>
            <Link href="/history" className={secondaryBtn}>
              Lihat riwayat reservasi
            </Link>
          </div>
        </div>
        {summary}
      </div>
    );

  if (appointment.status === 'waiting_confirmation')
    return (
      <div className="grid gap-6">
        <div role="status" className={`${card} border-blue-300 bg-blue-50 text-blue-950`}>
          <h2 className="text-2xl font-bold tracking-tight">Menunggu konfirmasi admin</h2>
          <p className="mt-2">
            Kuota Anda sudah aman. Klinik akan memverifikasi pembayaran Anda secepatnya. Bila admin
            belum memproses sampai jadwal dimulai, reservasi otomatis dibatalkan.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/history" className={primaryBtn}>
              Lihat riwayat reservasi
            </Link>
            {cancelButton}
          </div>
        </div>
        {summary}
        {cancelModal}
      </div>
    );

  if (appointment.status === 'done')
    return (
      <div className="grid gap-6">
        <AppointmentQr appointment={appointment} />
        {appointment.can_rate && <RatingForm appointment={appointment} />}
        {appointment.ratings && (
          <section aria-labelledby="my-review-heading" className={card}>
            <h2 id="my-review-heading" className="text-xl font-bold text-[#1B1B7A]">
              Ulasan Anda
            </h2>
            <div className="mt-3">
              <RatingStars value={appointment.ratings.rating} size="md" />
            </div>
            {appointment.ratings.review && (
              <p className="mt-2 whitespace-pre-line text-neutral-700">
                {appointment.ratings.review}
              </p>
            )}
          </section>
        )}
        {summary}
        {cancelButton && <div>{cancelButton}</div>}
        {cancelModal}
      </div>
    );

  const isUrgent = remaining <= 60;

  return (
    <div className="grid gap-6">
      <p className="text-sm font-bold uppercase tracking-wide text-[#1B1B7A]">
        Langkah 2 dari 2 · Unggah bukti pembayaran
      </p>
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

      {summary}

      <section className={card} aria-label="Rekening tujuan">
        <div className="rounded-2xl bg-[#FAF8F3] px-4 py-3">
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={upload.isPending} className={primaryBtn}>
            {upload.isPending ? 'Mengunggah...' : 'Kirim bukti pembayaran'}
          </button>
          {cancelButton}
        </div>
      </form>
      {cancelModal}
    </div>
  );
}
