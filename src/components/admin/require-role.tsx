'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useMe } from '@/hooks/api/use-auth';
import type { TRole } from '@/types/auth';

type Props = {
  roles: TRole[];
  children: React.ReactNode;
  /** true bila dipakai di luar AdminShell (tanpa sidebar) */
  fullScreen?: boolean;
};

// Penjaga halaman di sisi browser. Keamanan sebenarnya tetap di backend
// (verifyToken + verifyRole); komponen ini hanya mencegah halaman tampil.
export default function RequireRole({ roles, children, fullScreen }: Props) {
  const router = useRouter();
  const { data: user, isPending, isError, refetch } = useMe();

  // Belum login (useMe mengembalikan null saat 401) → ke halaman login admin
  useEffect(() => {
    if (user === null) router.replace('/admin/login');
  }, [user, router]);

  if (user && roles.includes(user.role)) return <>{children}</>;

  let content: React.ReactNode;
  if (isPending || user === null) {
    content = (
      <p role="status" className="text-neutral-600">
        {isPending ? 'Memeriksa akses...' : 'Mengalihkan ke halaman login...'}
      </p>
    );
  } else if (isError) {
    content = (
      <>
        <p role="alert" className="text-neutral-700">
          Tidak dapat memeriksa akses. Periksa koneksi lalu coba lagi.
        </p>
        <button type="button" onClick={() => refetch()} className={`mt-5 ${primaryBtn}`}>
          Coba lagi
        </button>
      </>
    );
  } else {
    content = (
      <>
        <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Akses ditolak</h1>
        <p className="mt-2 text-neutral-600">
          Akun Anda tidak memiliki izin untuk membuka halaman ini.
        </p>
        <Link href="/" className={`mt-5 ${secondaryBtn}`}>
          Kembali ke beranda
        </Link>
      </>
    );
  }

  return (
    <div
      className={`flex items-center justify-center px-5 ${
        fullScreen ? 'min-h-screen bg-neutral-100' : 'min-h-[60vh]'
      }`}
    >
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-center md:p-8">
        {content}
      </div>
    </div>
  );
}
