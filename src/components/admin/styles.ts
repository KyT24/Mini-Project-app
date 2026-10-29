// Kelas Tailwind bersama untuk halaman admin (selaras dengan halaman user)

export const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

export const primaryBtn =
  'inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#1B1B7A] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 motion-reduce:transition-none';

export const secondaryBtn =
  'inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-2.5 font-bold text-[#1B1B7A] transition-colors hover:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:text-neutral-500 motion-reduce:transition-none';

export const dangerBtn =
  'inline-flex min-h-11 items-center justify-center rounded-2xl bg-red-700 px-5 py-2.5 font-bold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 motion-reduce:transition-none';

export const errorText = 'mt-1.5 text-sm font-medium text-red-700';

// Tombol teks kecil di kolom aksi tabel (Edit, Jadwal, Hapus)
export const actionLink =
  'inline-flex min-h-11 items-center rounded-lg px-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

// Varian berwarna navy dengan latar saat hover (halaman pembayaran)
export const actionLinkNavy =
  'inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#1B1B7A] hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';
