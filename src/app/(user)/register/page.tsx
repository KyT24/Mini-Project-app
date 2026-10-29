import Link from 'next/link';
import { RegisterForm } from '@/components/user/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* PANEL BRAND */}
      <aside
        className="relative flex flex-col justify-between overflow-hidden bg-[#1B1B7A] px-6 py-10 text-white md:px-12 md:py-14 lg:py-20"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 10% 10%, rgba(60,66,190,0.7), transparent 70%), radial-gradient(50% 60% at 90% 100%, rgba(8,10,70,0.9), transparent 70%)',
        }}
      >
        <div>
          <Link
            href="/"
            aria-label="Ke beranda"
            className="inline-block rounded-md bg-white px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src="/IH-logo-icon.png"
              alt="Logo klinik"
              className="h-9 w-auto"
            />
          </Link>

          <h1 className="mt-10 text-4xl font-bold tracking-tight md:text-5xl">
            Buat akun baru
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Daftar sekali, lalu atur jadwal perawatan dan pantau riwayat
            kunjungan Anda kapan saja.
          </p>

          <ul className="mt-8 hidden max-w-md gap-3 text-white/90 lg:grid">
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Reservasi perawatan tanpa antre telepon
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Lihat riwayat kunjungan dan perawatan
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F29A9A]"
              />
              Pengingat jadwal lewat WhatsApp
            </li>
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="mt-10 hidden h-1.5 w-24 rounded-full bg-[#F29A9A] lg:block"
        />
      </aside>

      {/* FORM */}
      <section className="flex items-center justify-center px-5 py-10 md:px-10 md:py-14">
        <RegisterForm />
      </section>
    </main>
  );
}
