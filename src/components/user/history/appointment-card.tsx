import Link from 'next/link';
import RatingStars from '@/components/user/booking/rating-stars';
import { STATUS_META } from '@/constants/transaction-status';
import { formatCountdown, formatDate, formatRupiah, formatTime } from '@/lib/format';
import { primaryBtn, secondaryBtn } from '@/lib/styles';
import type { TAppointment } from '@/types/appointment';

type Props = {
  appointment: TAppointment;
  /** Sisa detik upload bukti bayar (0 bila tidak menunggu pembayaran) */
  remaining: number;
};

// Satu kartu reservasi di halaman riwayat
export function AppointmentCard({ appointment: a, remaining }: Props) {
  const waiting = a.status === 'waiting_payment' && remaining > 0;
  // Hold yang baru habis di browser ditampilkan kedaluwarsa sebelum data dimuat ulang
  const status = STATUS_META[a.status === 'waiting_payment' && !waiting ? 'expired' : a.status];
  const session = a.practice_sessions;

  return (
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

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 sm:text-base lg:grid-cols-4">
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
          <dt className="text-neutral-600">No. antrean</dt>
          <dd className="font-semibold tabular-nums">{a.queue_number ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-neutral-600">Biaya konsultasi</dt>
          <dd className="font-semibold">{formatRupiah(a.consultation_fee)}</dd>
          <dd className="text-sm text-neutral-600">
            Total {formatRupiah(a.total_amount)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {waiting ? (
          <p className="font-semibold text-amber-950">
            Sisa waktu unggah bukti:{' '}
            <span className="tabular-nums">{formatCountdown(remaining)}</span>
          </p>
        ) : a.ratings ? (
          <p className="flex items-center gap-2 text-sm text-neutral-700">
            Rating Anda <RatingStars value={a.ratings.rating} />
          </p>
        ) : (
          <span />
        )}
        <Link
          href={a.can_rate ? `/payment/${a.id}#rating` : `/payment/${a.id}`}
          className={waiting || a.can_rate ? primaryBtn : secondaryBtn}
        >
          {waiting ? 'Lanjutkan pembayaran' : a.can_rate ? 'Beri rating' : 'Lihat detail'}
          <span className="sr-only"> reservasi {a.appointment_code}</span>
        </Link>
      </div>
    </article>
  );
}
