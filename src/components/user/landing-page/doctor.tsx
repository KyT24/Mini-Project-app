export const doctors = [
  {
    name: 'dr. Nama Dokter 1',
    role: 'Dokter Estetika',
    experience: '5 tahun pengalaman',
    focus: 'Fokus pada perawatan jerawat dan bekas jerawat.',
    image: '/doctors/dokter-1.jpg',
  },
  {
    name: 'dr. Nama Dokter 2',
    role: 'Dokter Estetika',
    experience: '7 tahun pengalaman',
    focus: 'Fokus pada perawatan pencerahan dan peremajaan kulit.',
    image: '/doctors/dokter-2.jpg',
  },
  {
    name: 'dr. Nama Dokter 3, Sp.DV',
    role: 'Spesialis Kulit',
    experience: '10 tahun pengalaman',
    focus: 'Menangani masalah kulit dan konsultasi perawatan lanjutan.',
    image: '/doctors/dokter-3.jpg',
  },
  {
    name: 'dr. Nama Dokter 4',
    role: 'Dokter Umum',
    experience: '4 tahun pengalaman',
    focus: 'Melayani konsultasi awal dan perawatan rambut serta tubuh.',
    image: '/doctors/dokter-4.jpg',
  },
];

export function DoctorList({
  waLink,
}: {
  waLink: (message: string) => string;
}) {
  return (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4">
          {doctors.map((d) => (
            <li key={d.name}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg md:rounded-3xl">
                <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5 sm:aspect-4/5">
                  <img
                    src={d.image}
                    alt={`Foto ${d.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                    {d.role}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                    {d.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 sm:text-base">
                    {d.experience}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-base">
                    {d.focus}
                  </p>
                  <a
                    href={waLink(
                      `Halo, saya ingin konsultasi dengan ${d.name}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center rounded-xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] md:mt-6 md:rounded-2xl"
                  >
                    Konsultasi Sekarang
                    <span className="sr-only">
                      {' '}
                      dengan {d.name} lewat WhatsApp (membuka tab baru)
                    </span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
  );
}
