import { Suspense } from 'react';
import RequirePatient from '@/components/user/booking/require-patient';
import { AppointmentList } from '@/components/user/history/appointment-list';

export default function HistoryPage() {
  return (
    <main id="main" className="min-h-[60vh] bg-neutral-100 text-neutral-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1B1B7A] md:text-4xl">
          Riwayat reservasi
        </h1>
        <p className="mt-2 text-neutral-600">
          Lihat status, nomor antrean, dan QR reservasi Anda.
        </p>

        <div className="mt-8">
          {/* RequirePatient membaca usePathname, dibungkus Suspense (cacheComponents) */}
          <Suspense>
            <RequirePatient>
              <AppointmentList />
            </RequirePatient>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
