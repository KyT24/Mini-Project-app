import type { TPaginateMeta } from '@/types/api';

type Props = {
  /** aria-label, mis. "Paginasi daftar dokter" */
  label: string;
  page: number;
  totalPages: number;
  /** Teks tambahan setelah nomor halaman, mis. "12 dokter" */
  summary?: string;
  /** true saat data sedang dimuat ulang */
  disabled?: boolean;
  onPageChange: (page: number) => void;
  /** Kelas tombol: admin & pasien punya ukuran tombol berbeda */
  buttonClassName: string;
  /** Jarak atas, mis. "mt-5" */
  className?: string;
};

// Jumlah halaman dari meta backend, minimal 1
export function getTotalPages(meta?: TPaginateMeta) {
  return Math.max(meta?.total_pages ?? 1, 1);
}

// Navigasi halaman sebelumnya/berikutnya untuk daftar berpaginasi
export function Pagination({
  label,
  page,
  totalPages,
  summary,
  disabled,
  onPageChange,
  buttonClassName,
  className = '',
}: Props) {
  return (
    <nav
      aria-label={label}
      className={`${className} flex flex-col items-center justify-between gap-3 sm:flex-row`}
    >
      <p className="text-neutral-600">
        Halaman {page} dari {totalPages}
        {summary && ` · ${summary}`}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1 || disabled}
          className={buttonClassName}
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || disabled}
          className={buttonClassName}
        >
          Berikutnya
        </button>
      </div>
    </nav>
  );
}
