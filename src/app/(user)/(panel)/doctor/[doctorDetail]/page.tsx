import Link from 'next/link';
import { Suspense } from 'react';
import { linkClass } from '@/lib/styles';
import { DoctorProfile } from '@/components/user/doctor/doctor-profile';

export const metadata = { title: 'Profil Dokter' };

export default function DoctorDetailPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] text-neutral-900">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-4 md:px-8 md:pb-24 md:pt-8">
        <Link href="/doctor" className={`inline-flex min-h-11 items-center ${linkClass}`}>
          Kembali ke daftar dokter
        </Link>

        {/* DoctorProfile membaca useParams, aman di dalam Suspense (cacheComponents) */}
        <Suspense
          fallback={
            <p role="status" className="mt-6 text-neutral-700">
              Memuat profil dokter...
            </p>
          }
        >
          <DoctorProfile />
        </Suspense>
      </div>
    </main>
  );
}
