import { Suspense } from 'react';
import { DoctorBrowser } from '@/components/user/doctor/doctor-browser';

export const metadata = { title: 'Dokter Kami' };

export default function DoctorPage() {
  return (
    <div className="bg-[#FAF8F3]">
      <section
        aria-labelledby="doctors-heading"
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16"
      >
        <h1
          id="doctors-heading"
          className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#1B1B7A] sm:text-4xl md:text-5xl"
        >
          Temukan dokter untuk kebutuhan kulitmu
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">
          Cari berdasarkan spesialis, biaya, atau hari praktik, lalu buka profilnya
          untuk melihat jadwal dan membuat reservasi.
        </p>

        {/* DoctorBrowser membaca useSearchParams, wajib di dalam Suspense */}
        <Suspense
          fallback={
            <p role="status" className="mt-10 text-neutral-700">
              Memuat dokter...
            </p>
          }
        >
          <DoctorBrowser />
        </Suspense>
      </section>
    </div>
  );
}
