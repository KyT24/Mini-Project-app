import Image from 'next/image';

export function Hero() {
  return (
    <header className="grid bg-[#FAF8F3] md:min-h-screen md:grid-cols-2">
      <div className="flex items-center px-5 py-12 sm:py-16 md:px-12 md:py-24 lg:px-20">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#1B1B7A] sm:text-4xl md:text-5xl lg:text-6xl">
            Klinik Kecantikan Terbaik Di Indonesia,
          </h1>
          <span
            aria-hidden="true"
            className="mt-5 block h-1 w-16 rounded-full bg-[#F29A9A] md:mt-6 md:w-20"
          />
          <p className="mt-5 text-base text-gray-700 sm:text-lg md:mt-6 md:text-2xl">
            Atasi Berbagai Masalah Kulit Anda
          </p>
        </div>
      </div>

      <div className="relative h-64 sm:h-96 md:h-auto">
        <Image
          src="/hero/clinic-waiting-room.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </header>
  );
}
