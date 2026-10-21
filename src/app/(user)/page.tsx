'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const categories = [
  'Acne & Scar',
  'Brightening',
  'Anti-Aging',
  'Hair',
  'Slimming',
] as const;

type Category = (typeof categories)[number];

type Treatment = {
  title: string;
  description: string;
  category: Category;
  image?: string; // contoh: '/treatments/acne-dermapeel.jpg'
  action?: 'detail' | 'reserve';
  href?: string;
};

const treatments: Treatment[] = [
  // Acne & Scar
  {
    title: 'Acne Dermapeel',
    description:
      'Menggunakan larutan kimia untuk mengangkat lapisan kulit terluar. Kulit baru yang muncul lebih halus dan cerah.',
    category: 'Acne & Scar',
  },
  {
    title: 'IPL Acne',
    description:
      'Memanfaatkan energi cahaya untuk membuat wajah lebih halus, cerah, dan membasmi jerawat.',
    category: 'Acne & Scar',
    action: 'reserve',
  },
  {
    title: 'Acne Laser Co2',
    description:
      'Menggunakan energi cahaya berintensitas tinggi untuk mengangkat sel kulit mati dan mempercepat regenerasi kulit.',
    category: 'Acne & Scar',
  },
  {
    title: 'Acne Facial',
    description:
      'Pengelupasan sel kulit mati, pemberian nutrisi, serta pelembapan untuk membuat kulit wajah lebih sehat.',
    category: 'Acne & Scar',
  },
  // Brightening
  {
    title: 'Brightening Facial',
    description:
      'Perawatan wajah untuk membantu mencerahkan kulit yang tampak kusam dan tidak merata.',
    category: 'Brightening',
  },
  {
    title: 'Glow Peeling',
    description:
      'Peeling ringan untuk mengangkat sel kulit mati sehingga kulit tampak lebih cerah dan segar.',
    category: 'Brightening',
  },
  {
    title: 'Vitamin C Infusion',
    description:
      'Pemberian nutrisi vitamin C ke kulit untuk membantu tampilan wajah lebih bercahaya.',
    category: 'Brightening',
    action: 'reserve',
  },
  // Anti-Aging
  {
    title: 'Anti-Aging Facial',
    description:
      'Perawatan wajah untuk membantu menjaga kekenyalan dan tampilan kulit agar tetap awet muda.',
    category: 'Anti-Aging',
  },
  {
    title: 'Skin Booster',
    description:
      'Membantu melembapkan kulit dari dalam agar tampak lebih kenyal dan sehat.',
    category: 'Anti-Aging',
    action: 'reserve',
  },
  {
    title: 'RF Lifting',
    description:
      'Menggunakan energi radiofrekuensi untuk membantu kulit tampak lebih kencang.',
    category: 'Anti-Aging',
  },
  // Hair
  {
    title: 'Hair Treatment',
    description:
      'Perawatan kulit kepala dan rambut untuk membantu rambut tampak lebih sehat dan kuat.',
    category: 'Hair',
  },
  {
    title: 'Laser Hair Removal',
    description:
      'Membantu mengurangi pertumbuhan rambut yang tidak diinginkan dengan energi laser.',
    category: 'Hair',
    action: 'reserve',
  },
  // Slimming
  {
    title: 'Body Slimming',
    description:
      'Perawatan tubuh untuk membantu membentuk kontur tubuh dengan teknologi non-invasif.',
    category: 'Slimming',
  },
  {
    title: 'Body Contouring',
    description:
      'Membantu menyamarkan tampilan lemak membandel pada area tertentu.',
    category: 'Slimming',
    action: 'reserve',
  },
];

const RESERVE_HREF = 'https://wa.me/628xxxxxxxxxx'; // ganti dengan nomor klinik
const NAVY = '#1B1B7A';

export default function LandingPage() {
  const [active, setActive] = useState<Category>('Acne & Scar');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = treatments.filter((t) => t.category === active);

  // Navigasi tab dengan panah keyboard
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (e.key === 'ArrowLeft')
      next = (index - 1 + categories.length) % categories.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = categories.length - 1;
    else return;
    e.preventDefault();
    setActive(categories[next]);
    tabRefs.current[next]?.focus();
  }

  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  // Hitung lebar langkah (lebar kartu + jarak) dan halaman aktif
  function measure() {
    const el = trackRef.current;
    if (!el || el.children.length === 0) return null;
    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement | undefined;
    const step = second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;
    const lastPage = Math.max(
      0,
      Math.round((el.scrollWidth - el.clientWidth) / step),
    );
    return { el, step, lastPage };
  }

  function update() {
    const m = measure();
    if (!m) return;
    setPages(m.lastPage + 1);
    setPage(Math.min(Math.round(m.el.scrollLeft / m.step), m.lastPage));
  }

  function goTo(i: number) {
    const m = measure();
    if (!m) return;
    const target = Math.max(0, Math.min(i, m.lastPage));
    m.el.scrollTo({ left: target * m.step, behavior: 'smooth' });
  }

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <header className="min-h-screen bg-gray-400 flex justify-center items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            Klinik Kecantikan Terbaik Di Indonesia,
          </h1>
          <p>Atasi Berbagai Masalah Kulit Anda</p>
        </div>
      </header>
      <section
        aria-roledescription="carousel"
        aria-label="Hasil perawatan sebelum dan sesudah"
        className="bg-white py-12 md:py-16"
      >
        <div className="relative px-4 md:px-5">
          {/* PANAH KIRI */}
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Hasil sebelumnya"
            className="absolute left-6 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition-opacity hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 md:left-8"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {/* DAFTAR KARTU */}
          <ul
            ref={trackRef}
            onScroll={update}
            tabIndex={0}
            aria-label="Daftar hasil perawatan"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] md:gap-4.5 [&::-webkit-scrollbar]:hidden"
          >
            {/* KARTU 1 */}
            <li
              aria-roledescription="slide"
              aria-label="1 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              {/* Ganti src dengan foto hasil perawatan Anda (gabungan before + after) */}
              <img
                src="/results/hair-grow-combo.jpg"
                alt="Hasil Hair Grow Combo, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Hair Grow Combo
              </p>
            </li>

            {/* KARTU 2 */}
            <li
              aria-roledescription="slide"
              aria-label="2 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              <img
                src="/results/pink-lips.jpg"
                alt="Hasil Pink Lips, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Pink Lips
              </p>
            </li>

            {/* KARTU 3 */}
            <li
              aria-roledescription="slide"
              aria-label="3 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              <img
                src="/results/laser-co2.jpg"
                alt="Hasil Laser Co2, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Laser Co2
              </p>
            </li>

            {/* KARTU 4 */}
            <li
              aria-roledescription="slide"
              aria-label="4 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              <img
                src="/results/brightening.jpg"
                alt="Hasil Brightening, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Brightening
              </p>
            </li>

            {/* KARTU 5 */}
            <li
              aria-roledescription="slide"
              aria-label="5 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              <img
                src="/results/acne-facial.jpg"
                alt="Hasil Acne Facial, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Acne Facial
              </p>
            </li>

            {/* KARTU 6 */}
            <li
              aria-roledescription="slide"
              aria-label="6 dari 6"
              className="relative aspect-5/3 w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#14188f] sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)]"
            >
              <img
                src="/results/body-slimming.jpg"
                alt="Hasil Body Slimming, sebelum dan sesudah"
                loading="lazy"
                className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
              />
              <span className="absolute bottom-[20%] left-0 rounded-tr-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                Before
              </span>
              <span className="absolute bottom-[20%] left-1/2 rounded-t-xl bg-[#E9DFCB] px-4 py-1.5 text-lg font-medium text-[#1B1B7A]">
                After
              </span>
              <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] font-serif text-2xl font-semibold text-white md:text-4xl">
                Body Slimming
              </p>
            </li>
          </ul>

          {/* PANAH KANAN */}
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= pages - 1}
            aria-label="Hasil berikutnya"
            className="absolute right-6 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition-opacity hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 md:right-8"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* TITIK HALAMAN */}
        <div
          className="mt-6 flex items-center justify-center"
          role="group"
          aria-label="Pilih halaman"
        >
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Halaman ${i + 1}`}
              aria-current={i === page ? 'true' : undefined}
              className="grid h-6 w-6 place-items-center focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1B1B7A]"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                  i === page ? 'bg-neutral-900' : 'bg-neutral-300'
                }`}
              />
            </button>
          ))}
        </div>
      </section>
      );
      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <h2
          className="text-3xl font-bold tracking-tight md:text-4xl"
          style={{ color: NAVY }}
        >
          Temukan Perawatan Terbaik Sesuai Permasalahan Kulitmu
        </h2>

        {/* TAB KATEGORI */}
        <div
          role="tablist"
          aria-label="Kategori perawatan"
          className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:justify-center [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c, i) => {
            const selected = c === active;
            return (
              <button
                key={c}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${i}`}
                aria-selected={selected}
                aria-controls="panel-treatments"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`shrink-0 rounded-full border px-6 py-3 text-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
                  selected
                    ? 'border-[#1B1B7A] bg-[#1B1B7A] text-white shadow-md'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-[#1B1B7A] hover:text-[#1B1B7A]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* BARIS CARD */}
        <div
          role="tabpanel"
          id="panel-treatments"
          aria-labelledby={`tab-${categories.indexOf(active)}`}
          tabIndex={0}
          className="mt-10 grid gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] sm:grid-cols-2 lg:grid-cols-4"
        >
          {visible.map((t) => (
            <article
              key={t.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-4/3 w-full bg-linea-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
                {t.image && (
                  <img
                    src={t.image}
                    alt={t.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <span
                  className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide"
                  style={{ color: NAVY }}
                >
                  {t.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: NAVY }}
                >
                  {t.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-neutral-600">
                  {t.description}
                </p>

                <a
                  href={
                    t.action === 'reserve'
                      ? (t.href ?? RESERVE_HREF)
                      : (t.href ?? '#')
                  }
                  {...(t.action === 'reserve'
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="mt-6 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1B1B7A] px-4 py-3.5 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                >
                  {t.action === 'reserve'
                    ? 'Reservasi Sekarang'
                    : 'Lihat Selengkapnya'}
                  {t.action === 'reserve' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                  <span className="sr-only">: {t.title}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="clinic-banner-heading"
        className="relative isolate overflow-hidden bg-[#0d1266] px-5 py-14 text-white md:px-8 md:py-20"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 15% 20%, rgba(30,36,150,0.9), transparent 70%), radial-gradient(50% 70% at 85% 90%, rgba(5,8,60,0.9), transparent 70%), radial-gradient(40% 60% at 50% 5%, rgba(24,28,130,0.8), transparent 70%)',
        }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <h2
            id="clinic-banner-heading"
            className="text-center text-2xl font-medium tracking-tight md:text-4xl"
          >
            Kunjungi Klinik Kecantikan Terdekat Anda
          </h2>

          <div className="mt-10 grid w-full items-center gap-8 md:mt-14 md:grid-cols-[auto_1fr] md:gap-16">
            {/* ANGKA + GARIS BAWAH */}
            <div className="mx-auto md:mx-0">
              <p className="text-5xl font-medium tracking-tight md:text-7xl">
                70+ Klinik
              </p>
            </div>

            {/* DESKRIPSI */}
            <p className="max-w-xl text-center text-lg leading-relaxed text-white/90 md:text-left md:text-xl">
              Klinik kecantikan terdekat dari Rumahmu. Tersebar di seluruh kota
              besar di Indonesia.
            </p>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="advantages-heading"
        className="bg-white px-5 py-14 text-[#1B1B7A] md:px-8 md:py-20"
      >
        <div className="mx-auto w-full max-w-5xl">
          <h2
            id="advantages-heading"
            className="text-center text-2xl font-medium tracking-tight md:text-4xl"
          >
            Keunggulan Klinik Kami Dibanding Beauty Clinic Lain
          </h2>

          <ul className="mt-10 grid gap-x-16 gap-y-8 md:mt-14 md:grid-cols-2">
            {/* KOLOM KIRI */}
            <li>
              <h3 className="text-2xl font-semibold">
                Tenaga Medis Profesional
              </h3>
              <p className="mt-1 text-lg">
                Ditangani oleh dokter berpengalaman
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-semibold">Teknologi Terkini</h3>
              <p className="mt-1 text-lg">
                Mesin berkualitas tinggi untuk hasil maksimal
              </p>
            </li>

            <li>
              <h3 className="text-2xl font-semibold">Pelayanan Terbaik</h3>
              <p className="mt-1 text-lg">
                Klinik kecantikan yang nyaman dan ramah
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-semibold">
                Konsultasi Dokter Gratis
              </h3>
              <p className="mt-1 text-lg">
                Reservasi sekarang dan konsultasikan kondisi kulitmu
              </p>
            </li>

            <li>
              <h3 className="text-2xl font-semibold">Harga Terjangkau</h3>
              <p className="mt-1 text-lg">
                Perawatan premium dengan harga terjangkau
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-semibold">
                Klinik Kecantikan Terdekat
              </h3>
              <p className="mt-1 text-lg">
                Tersebar di beberapa kota besar di Indonesia
              </p>
            </li>
          </ul>
        </div>
      </section>
      <section
        aria-label="Angka penting klinik"
        className="bg-white"
      >
        <ul className="grid md:grid-cols-3">
          {/* PANEL 1: DOKTER */}
          <li className="relative isolate flex min-h-70 items-center justify-center overflow-hidden bg-[#2b2f94] px-5 py-14 text-white md:min-h-105">
            {/* Ganti src dengan foto Anda di folder public, mis. /stats/dokter.jpg */}
            <img
              src="/stats/dokter.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-b from-[#1B1B7A]/50 via-[#1B1B7A]/70 to-[#1B1B7A]/95"
            />
            <div className="text-center">
              <p className="text-6xl font-bold tracking-tight md:text-7xl">
                100+
              </p>
              <div
                aria-hidden="true"
                className="mx-auto mt-5 h-0.5 w-16 bg-white"
              />
              <p className="mt-4 text-2xl font-medium uppercase tracking-[0.2em]">
                Dokter
              </p>
            </div>
          </li>

          {/* PANEL 2: PASIEN */}
          <li className="relative isolate flex min-h-70 items-center justify-center overflow-hidden bg-[#2b2f94] px-5 py-14 text-white md:min-h-105">
            <img
              src="/stats/pasien.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-b from-[#1B1B7A]/50 via-[#1B1B7A]/70 to-[#1B1B7A]/95"
            />
            <div className="text-center">
              <p className="text-6xl font-bold tracking-tight md:text-7xl">
                500.000+
              </p>
              <div
                aria-hidden="true"
                className="mx-auto mt-5 h-0.5 w-16 bg-white"
              />
              <p className="mt-4 text-2xl font-medium uppercase tracking-[0.2em]">
                Pasien
              </p>
            </div>
          </li>

          {/* PANEL 3: CABANG */}
          <li className="relative isolate flex min-h-70 items-center justify-center overflow-hidden bg-[#2b2f94] px-5 py-14 text-white md:min-h-105">
            <img
              src="/stats/cabang.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-b from-[#1B1B7A]/50 via-[#1B1B7A]/70 to-[#1B1B7A]/95"
            />
            <div className="text-center">
              <p className="text-6xl font-bold tracking-tight md:text-7xl">
                60+
              </p>
              <div
                aria-hidden="true"
                className="mx-auto mt-5 h-0.5 w-16 bg-white"
              />
              <p className="mt-4 text-2xl font-medium uppercase tracking-[0.2em]">
                Cabang
              </p>
            </div>
          </li>
        </ul>
      </section>
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
        </ul>
      </section>
    </>
  );
}
