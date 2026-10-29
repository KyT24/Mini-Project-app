import type { TTransactionStatus } from '@/types/appointment';

// Label & warna 6 status transaksi, dipakai halaman pasien dan admin
export const STATUS_META: Record<TTransactionStatus, { label: string; className: string }> = {
  waiting_payment: { label: 'Menunggu pembayaran', className: 'bg-amber-100 text-amber-950' },
  waiting_confirmation: {
    label: 'Menunggu konfirmasi admin',
    className: 'bg-blue-100 text-blue-900',
  },
  done: { label: 'Terkonfirmasi', className: 'bg-green-100 text-green-900' },
  rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-900' },
  expired: { label: 'Kedaluwarsa', className: 'bg-neutral-200 text-neutral-800' },
  canceled: { label: 'Dibatalkan', className: 'bg-neutral-200 text-neutral-800' },
};
