'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMe } from '@/hooks/api/use-auth';
import { card, primaryBtn, secondaryBtn } from '@/lib/styles';

type Props = { children: React.ReactNode };

// Reservasi hanya untuk akun pasien. Keamanan sebenarnya tetap di backend.
export default function RequirePatient({ children }: Props) {
  const pathname = usePathname();
  const { data: user, isPending, isError, refetch } = useMe();

  if (user?.role === 'PATIENT') return <>{children}</>;

  if (isPending)
    return (
      <p role="status" className={`${card} text-center text-neutral-600`}>
        Memeriksa akun...
      </p>
    );

  if (isError)
    return (
      <div role="alert" className={`${card} text-center`}>
        <p className="text-neutral-700">Tidak dapat memeriksa akun. Periksa koneksi lalu coba lagi.</p>
        <button type="button" onClick={() => refetch()} className={`mt-5 ${primaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );

  if (!user)
    return (
      <div className={`${card} text-center`}>
        <h2 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Masuk untuk reservasi</h2>
        <p className="mt-2 text-neutral-600">
          Silakan masuk dengan akun pasien agar kami bisa menyimpan jadwal Anda.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className={primaryBtn}>
            Masuk
          </Link>
          <Link href="/register" className={secondaryBtn}>
            Daftar akun baru
          </Link>
        </div>
      </div>
    );

  return (
    <div role="alert" className={`${card} text-center`}>
      <h2 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">Khusus akun pasien</h2>
      <p className="mt-2 text-neutral-600">
        Anda masuk sebagai {user.role.toLowerCase()}. Reservasi hanya bisa dilakukan dengan akun
        pasien.
      </p>
    </div>
  );
}
