// Kelas Tailwind bersama untuk halaman pasien (admin punya versi sendiri di components/admin/styles.ts)

export const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

export const primaryBtn =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#1B1B7A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 motion-reduce:transition-none';

export const secondaryBtn =
  'inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-6 py-3 font-bold text-[#1B1B7A] transition-colors hover:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] disabled:cursor-not-allowed disabled:text-neutral-500 motion-reduce:transition-none';

export const dangerBtn =
  'inline-flex min-h-11 items-center justify-center rounded-2xl bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 motion-reduce:transition-none';

// Tombol "Tampilkan/Sembunyikan" di dalam input password
export const toggleBtn =
  'absolute inset-y-0 right-0 rounded-r-xl px-4 text-sm font-semibold text-[#1B1B7A] hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

export const linkClass =
  'font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

export const errorText = 'mt-1.5 text-sm font-medium text-red-700';

export const card = 'rounded-3xl border border-neutral-200 bg-white p-6 md:p-8';

/** Kelas input dengan border merah bila ada error */
export function inputClass(error?: string) {
  return `${inputBase} ${error ? 'border-red-600' : 'border-neutral-300'}`;
}
