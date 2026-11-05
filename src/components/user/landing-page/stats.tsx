const stats = [
  { value: '100+', label: 'Dokter', image: '/stats/dokter.jpg' },
  { value: '500.000+', label: 'Pasien', image: '/stats/pasien.jpg' },
  { value: '10+', label: 'Cabang', image: '/stats/cabang.jpg' },
];

export function Stats() {
  return (
    <section aria-label="Angka penting klinik" className="bg-white">
      <ul className="grid md:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="relative isolate flex min-h-52 items-center justify-center overflow-hidden bg-[#2b2f94] px-5 py-10 text-white md:min-h-96 md:px-3 md:py-14"
          >
            <img
              src={stat.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-b from-[#1B1B7A]/50 via-[#1B1B7A]/70 to-[#1B1B7A]/95"
            />
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                {stat.value}
              </p>
              <div
                aria-hidden="true"
                className="mx-auto mt-4 h-0.5 w-14 bg-white md:mt-5 md:w-16"
              />
              <p className="mt-3 text-xl font-medium uppercase tracking-[0.2em] md:mt-4 md:text-2xl">
                {stat.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
