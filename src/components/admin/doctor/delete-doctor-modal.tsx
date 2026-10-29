'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { dangerBtn, secondaryBtn } from '@/components/admin/styles';
import { useDeleteDoctor, useUpdateDoctor } from '@/hooks/api/use-doctors';
import type { TDoctor } from '@/types/doctor';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';

type Props = {
  doctor: TDoctor;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export default function DeleteDoctorModal({ doctor, onClose, onSuccess }: Props) {
  const [serverError, setServerError] = useState('');
  // Backend menolak hapus (409) bila dokter masih punya janji temu / sesi / rating
  const [hasRelations, setHasRelations] = useState(false);

  const deleteDoctor = useDeleteDoctor();
  const updateDoctor = useUpdateDoctor();
  const isPending = deleteDoctor.isPending || updateDoctor.isPending;

  return (
    <Modal title="Hapus dokter" titleId="delete-doctor-title" onClose={onClose} locked={isPending}>
      <>
        {hasRelations ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
          >
            <strong>{doctor.full_name}</strong> masih memiliki janji temu, sesi praktik, atau rating
            sehingga tidak bisa dihapus. Nonaktifkan dokter ini agar tidak tampil untuk pasien.
          </div>
        ) : (
          <p>
            Hapus <strong>{doctor.full_name}</strong>? Tindakan ini tidak bisa dibatalkan.
          </p>
        )}

        {serverError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
          >
            {serverError}
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={isPending} className={secondaryBtn}>
            Batal
          </button>

          {hasRelations ? (
            doctor.is_active && (
              <button
                type="button"
                disabled={isPending}
                className={dangerBtn}
                onClick={() => {
                  setServerError('');
                  updateDoctor.mutate(
                    { id: doctor.id, body: { is_active: false } },
                    {
                      onSuccess: () => {
                        onSuccess(`${doctor.full_name} berhasil dinonaktifkan.`);
                        onClose();
                      },
                      onError: (error) =>
                        setServerError(getApiErrorMessage(error, 'Gagal menonaktifkan dokter.')),
                    },
                  );
                }}
              >
                {updateDoctor.isPending ? 'Memproses...' : 'Nonaktifkan'}
              </button>
            )
          ) : (
            <button
              type="button"
              disabled={isPending}
              className={dangerBtn}
              onClick={() => {
                setServerError('');
                deleteDoctor.mutate(doctor.id, {
                  onSuccess: () => {
                    onSuccess(`${doctor.full_name} berhasil dihapus.`);
                    onClose();
                  },
                  onError: (error) => {
                    if (getApiStatus(error) === 409) setHasRelations(true);
                    else setServerError(getApiErrorMessage(error, 'Gagal menghapus dokter.'));
                  },
                });
              }}
            >
              {deleteDoctor.isPending ? 'Menghapus...' : 'Hapus'}
            </button>
          )}
        </div>
      </>
    </Modal>
  );
}
