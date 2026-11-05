import { Suspense } from 'react';
import PaymentUpload from '@/components/user/booking/payment-upload';
import RequirePatient from '@/components/user/booking/require-patient';

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[#1B1B7A] md:text-4xl">
          Detail reservasi
        </h1>

        <div className="mt-6">
          {/* useParams/usePathname di route dinamis perlu Suspense (cacheComponents) */}
          <Suspense>
            <RequirePatient>
              <PaymentUpload />
            </RequirePatient>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
