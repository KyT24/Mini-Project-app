'use client';

import { useEffect, useState } from 'react';
import { useUploadPaymentProof } from '@/hooks/api/use-appointments';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { card, errorText, primaryBtn } from '@/lib/styles';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // sama dengan backend
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type Props = {
  appointmentId: string;
  /** Server menolak karena waktu upload sudah habis (410) */
  onExpired: () => void;
  /** Tombol "Batalkan booking" dari induk, ditaruh di samping tombol kirim */
  cancelButton?: React.ReactNode;
};

// Form pilih & kirim foto bukti transfer, lengkap dengan validasi dan pratinjau
export function PaymentProofForm({ appointmentId, onExpired, cancelButton }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [serverError, setServerError] = useState('');

  // Lepas object URL lama saat pratinjau diganti / komponen ditutup
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const upload = useUploadPaymentProof({
    onError: (err) => {
      const status = getApiStatus(err);
      if (status === 410) onExpired();
      else if (status === 413) setFileError('Ukuran file maksimal 2 MB.');
      else if (status === 401) setServerError('Sesi Anda berakhir. Silakan masuk kembali.');
      else setServerError(getApiErrorMessage(err, 'Gagal mengunggah bukti pembayaran.'));
    },
  });

  function selectFile(selected: File | null) {
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : '');
  }

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
    upload.mutate({ id: appointmentId, file });
  }

  return (
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
  );
}
