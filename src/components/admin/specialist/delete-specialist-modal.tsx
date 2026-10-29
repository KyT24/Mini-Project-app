'use client';

import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import Modal from '@/components/ui/modal';
import { dangerBtn, secondaryBtn } from '@/components/admin/styles';
import { useDeleteSpecialist, useUpdateSpecialist } from '@/hooks/api/use-specialists';
import type { TSpecialist } from '@/types/specialist';

type Props = {
  specialist: TSpecialist;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export default function DeleteSpecialistModal({ specialist, onClose, onSuccess }: Props) {
  const [serverError, setServerError] = useState('');
  // Backend menolak hapus (409) bila spesialis masih dipakai dokter
  const [inUse, setInUse] = useState(false);

  const deleteSpecialist = useDeleteSpecialist();
  const updateSpecialist = useUpdateSpecialist();
  const isPending = deleteSpecialist.isPending || updateSpecialist.isPending;

  return (
    <Modal
      title="Hapus spesialis"
      titleId="delete-specialist-title"
      onClose={onClose}
      locked={isPending}
    >
      <>
        {inUse ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
          >
            <strong>{specialist.name}</strong> masih dipakai oleh dokter sehingga tidak bisa
            dihapus. Nonaktifkan spesialis ini agar tidak bisa dipilih lagi.
          </div>
        ) : (
          <p>
            Hapus spesialis <strong>{specialist.name}</strong>? Tindakan ini tidak bisa dibatalkan.
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

          {inUse ? (
            specialist.is_active && (
              <button
                type="button"
                disabled={isPending}
                className={dangerBtn}
                onClick={() => {
                  setServerError('');
                  updateSpecialist.mutate(
                    { id: specialist.id, body: { is_active: false } },
                    {
                      onSuccess: () => {
                        onSuccess(`Spesialis ${specialist.name} berhasil dinonaktifkan.`);
                        onClose();
                      },
                      onError: (error) =>
                        setServerError(getApiErrorMessage(error, 'Gagal menonaktifkan spesialis.')),
                    },
                  );
                }}
              >
                {updateSpecialist.isPending ? 'Memproses...' : 'Nonaktifkan'}
              </button>
            )
          ) : (
            <button
              type="button"
              disabled={isPending}
              className={dangerBtn}
              onClick={() => {
                setServerError('');
                deleteSpecialist.mutate(specialist.id, {
                  onSuccess: () => {
                    onSuccess(`Spesialis ${specialist.name} berhasil dihapus.`);
                    onClose();
                  },
                  onError: (error) => {
                    if (getApiStatus(error) === 409) setInUse(true);
                    else setServerError(getApiErrorMessage(error, 'Gagal menghapus spesialis.'));
                  },
                });
              }}
            >
              {deleteSpecialist.isPending ? 'Menghapus...' : 'Hapus'}
            </button>
          )}
        </div>
      </>
    </Modal>
  );
}
