'use client';

import { QRCodeSVG } from 'qrcode.react';
import type { TAppointment } from '@/types/appointment';
import { card } from '@/lib/styles';

type Props = { appointment: TAppointment };

// QR berisi kode reservasi + token unik; ditunjukkan ke resepsionis saat datang
export default function AppointmentQr({ appointment }: Props) {
  if (!appointment.qr_token) return null;

  return (
    <section
      aria-labelledby="qr-heading"
      className={`${card} border-green-300 bg-green-50 text-green-950`}
    >
      <h2 id="qr-heading" className="text-2xl font-bold tracking-tight">
        Reservasi terkonfirmasi
      </h2>
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0 rounded-2xl bg-white p-4">
          <QRCodeSVG
            value={`${appointment.appointment_code}:${appointment.qr_token}`}
            size={192}
            level="M"
            title={`QR reservasi ${appointment.appointment_code}`}
          />
        </div>
        <dl className="text-center sm:text-left">
          <dt className="text-sm">Nomor antrean</dt>
          <dd className="text-5xl font-bold tabular-nums">{appointment.queue_number}</dd>
          <dd className="mt-3 max-w-sm text-sm">
            Tunjukkan QR ini ke resepsionis saat datang. Nomor antrean bisa maju bila pasien lain
            membatalkan reservasinya.
          </dd>
        </dl>
      </div>
    </section>
  );
}
