export default function DoctorPage() {
  return (
    <>
      <section
        aria-labelledby="doctors-heading"
        className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <h2
          id="doctors-heading"
          className="text-3xl font-bold tracking-tight text-[#1B1B7A] md:text-4xl"
        >
          Dokter Kami
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Perawatan ditangani langsung oleh dokter berpengalaman yang siap
          membantu mengenali kebutuhan kulitmu.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* DOKTER 1 */}
          <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                {/* Ganti src dengan foto dokter di folder public */}
                <img
                  src="/doctors/dokter-1.jpg"
                  alt="Foto dr. Nama Dokter 1"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 1
                </h3>
                <p className="mt-1 text-neutral-600">5 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan jerawat dan bekas jerawat.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 1 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>

          {/* DOKTER 2 */}
          <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>

          {/* DOKTER 3 */}
          <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-3.jpg"
                  alt="Foto dr. Nama Dokter 3"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Spesialis Kulit
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 3, Sp.DV
                </h3>
                <p className="mt-1 text-neutral-600">10 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Menangani masalah kulit dan konsultasi perawatan lanjutan.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 3 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>

          {/* DOKTER 4 */}
          <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-4.jpg"
                  alt="Foto dr. Nama Dokter 4"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Umum
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 4
                </h3>
                <p className="mt-1 text-neutral-600">4 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Melayani konsultasi awal dan perawatan rambut serta tubuh.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%204"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 4 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
            <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
  <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
  <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
  <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
  <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>
  <li>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                <img
                  src="/doctors/dokter-2.jpg"
                  alt="Foto dr. Nama Dokter 2"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
                  Dokter Estetika
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#1B1B7A]">
                  dr. Nama Dokter 2
                </h3>
                <p className="mt-1 text-neutral-600">7 tahun pengalaman</p>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  Fokus pada perawatan pencerahan dan peremajaan kulit.
                </p>
                <a
                  href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20konsultasi%20dengan%20dr.%20Nama%20Dokter%202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center rounded-2xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  Detail Doktor
                  <span className="sr-only">
                    {' '}
                    dengan dr. Nama Dokter 2 lewat WhatsApp (membuka tab baru)
                  </span>
                </a>
              </div>
            </article>
          </li>

        </ul>
      </section>
    </>
  );
}
