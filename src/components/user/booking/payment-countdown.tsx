import Link from 'next/link';
import { formatCountdown } from '@/lib/format';

type Props = { remaining: number };

// Kotak sisa waktu unggah bukti bayar; berubah merah di menit terakhir
export function PaymentCountdown({ remaining }: Props) {
  const isUrgent = remaining <= 60;

  return (
    <>
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
    </>
  );
}
