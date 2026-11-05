'use client';

import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import Modal from '@/components/ui/modal';
import { dangerBtn, secondaryBtn } from '@/lib/styles';
import { useCancelAppointment } from '@/hooks/api/use-appointments';
import type { TAppointment } from '@/types/appointment';

type Props = {
  appointment: TAppointment;
  onClose: () => void;
  /** Dipanggil saat backend menolak (409) agar data terbaru dimuat ulang */
  onStale: () => void;
};

export default function CancelAppointmentModal({ appointment, onClose, onStale }: Props) {
  const [serverError, setServerError] = useState('');

  const cancel = useCancelAppointment({
    onSuccess: onClose,
    onError: (error) => {
      if (getApiStatus(error) === 409) {
        setServerError('Reservasi ini sudah tidak bisa dibatalkan.');
        onStale();
      } else {
        setServerError(getApiErrorMessage(error, 'Gagal membatalkan reservasi.'));
      }
    },
  });

  return (
    <Modal
      title="Batalkan reservasi"
      titleId="cancel-appointment-title"
      onClose={onClose}
      locked={cancel.isPending}
    >
      <p>
        Batalkan reservasi <strong>{appointment.appointment_code}</strong>? Kuota akan dilepas untuk
        pasien lain dan <strong>tidak ada pengembalian dana</strong>.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={cancel.isPending} className={secondaryBtn}>
          Kembali
        </button>
        <button
          type="button"
          disabled={cancel.isPending}
          onClick={() => {
            setServerError('');
            cancel.mutate(appointment.id);
          }}
          className={dangerBtn}
        >
          {cancel.isPending ? 'Membatalkan...' : 'Ya, batalkan'}
        </button>
      </div>
    </Modal>
  );
}
