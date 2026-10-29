import { formatDate, formatRupiah, formatTime } from '@/lib/format';
import { card } from '@/lib/styles';
import type { TAppointment } from '@/types/appointment';

type Props = {
  appointment: TAppointment;
  status: { label: string; className: string };
};

// Ringkasan reservasi (kode, treatment, dokter, jadwal, total) di halaman pembayaran
export function PaymentSummary({ appointment, status }: Props) {
  const session = appointment.practice_sessions;

  return (
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
}
