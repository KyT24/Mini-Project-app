export function ClinicBanner() {
  return (
    <section
      aria-labelledby="clinic-banner-heading"
      className="relative isolate overflow-hidden bg-[#0d1266] px-5 py-12 text-white md:px-8 md:py-20"
      style={{
        backgroundImage:
          'radial-gradient(60% 80% at 15% 20%, rgba(30,36,150,0.9), transparent 70%), radial-gradient(50% 70% at 85% 90%, rgba(5,8,60,0.9), transparent 70%), radial-gradient(40% 60% at 50% 5%, rgba(24,28,130,0.8), transparent 70%)',
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <h2
          id="clinic-banner-heading"
          className="text-center text-2xl font-medium leading-tight tracking-tight md:text-4xl"
        >
          Kunjungi Klinik Kecantikan Terdekat Anda
        </h2>

        <div className="mt-8 grid w-full items-center gap-4 md:mt-14 md:grid-cols-[auto_1fr] md:gap-16">
          <p className="text-center text-5xl font-medium tracking-tight md:text-left md:text-7xl">
            70+ Klinik
          </p>
          <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-white/90 sm:text-lg md:mx-0 md:text-left md:text-xl">
            Klinik kecantikan terdekat dari Rumahmu. Tersebar di seluruh kota
            besar di Indonesia.
          </p>
        </div>
      </div>
    </section>
  );
}
