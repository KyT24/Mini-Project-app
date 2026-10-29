import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BookingForm from '@/components/user/booking/booking-form';
import RequirePatient from '@/components/user/booking/require-patient';
import { linkClass } from '@/lib/styles';
import { getTreatmentBySlug, treatments } from '@/constants/treatments';

export function generateStaticParams() {
  return treatments.map((t) => ({ treatmentSlug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<'/treatment/[treatmentSlug]/booking'>) {
  const { treatmentSlug } = await params;
  const treatment = getTreatmentBySlug(treatmentSlug);
  return { title: treatment ? `Reservasi ${treatment.title}` : 'Treatment tidak ditemukan' };
}

export default async function BookingPage({ params }: PageProps<'/treatment/[treatmentSlug]/booking'>) {
  const { treatmentSlug } = await params;
  const treatment = getTreatmentBySlug(treatmentSlug);

  if (!treatment) notFound();

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <Link href={`/treatment/${treatment.slug}`} className={linkClass}>
          Kembali ke {treatment.title}
        </Link>

        <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#1B1B7A]">
          Langkah 1 dari 2
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1B1B7A] md:text-4xl">
          Reservasi {treatment.title}
        </h1>
        <p className="mt-2 text-neutral-600">Pilih dokter dan jadwal yang Anda inginkan.</p>

        <div className="mt-6">
          {/* RequirePatient & BookingForm membaca usePathname/useSearchParams */}
          <Suspense>
            <RequirePatient>
              <BookingForm treatment={{ slug: treatment.slug, title: treatment.title }} />
            </RequirePatient>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
