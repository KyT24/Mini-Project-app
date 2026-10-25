import Link from 'next/link';
import { Suspense } from 'react';
import { linkClass } from '@/components/user/booking/styles';
import { DoctorProfile } from '@/components/user/doctor/doctor-profile';

export const metadata = { title: 'Profil Dokter' };

export default function DoctorDetailPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        <Link href="/doctor" className={linkClass}>
          Kembali ke daftar dokter
        </Link>

        {/* DoctorProfile membaca useParams, aman di dalam Suspense (cacheComponents) */}
        <Suspense
          fallback={
            <p role="status" className="mt-6 text-neutral-600">
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
