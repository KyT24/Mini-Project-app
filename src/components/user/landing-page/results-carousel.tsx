'use client';

import Link from 'next/link';
import {
  featuredTreatments,
  type Category,
  type Treatment,
} from './treatment';
import { useCarousel } from './use-carousel';

// Path ikon garis (viewBox 24x24) per kategori
const CATEGORY_ICON: Record<Category, React.ReactNode> = {
  'Acne & Scar': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1.2" />
      <circle cx="15" cy="9" r="1" />
      <circle cx="13" cy="15" r="1.4" />
    </>
  ),
  Brightening: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  'Anti-Aging': (
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
  ),
  Hair: (
    <path d="M7 21c0-6 1-11 5-14M12 21c0-5 .5-9 3-12M17 21c0-4 0-7 2-9M9 4c2-1.5 5-1.5 7 0" />
  ),
  Slimming: (
    <path d="M8 3c0 4 2 5 2 9s-2 5-2 9M16 3c0 4-2 5-2 9s2 5 2 9M4 12h3M17 12h3" />
  ),
};

function FeaturedSlide({
  treatment,
  label,
}: {
  treatment: Treatment;
  label: string;
}) {
  return (
    <li
      aria-roledescription="slide"
      aria-label={label}
      className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
    >
      <Link
        href={`/treatment/${treatment.slug}`}
        className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-2xl bg-[#1B1B7A] p-6 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] md:rounded-3xl md:p-7"
        style={{
          backgroundImage:
            'radial-gradient(70% 90% at 100% 0%, rgba(242,154,154,0.35), transparent 60%), radial-gradient(60% 80% at 0% 100%, rgba(8,10,70,0.9), transparent 70%)',
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="absolute -right-3 -top-3 text-[#F29A9A]/50 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 motion-reduce:transition-none"
        >
          {CATEGORY_ICON[treatment.category]}
        </svg>

        <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          {treatment.category}
        </span>
        <h3 className="mt-4 font-serif text-2xl font-semibold xl:text-3xl">
          {treatment.title}
        </h3>
        <p className="mt-2 flex-1 leading-relaxed text-white/85">
          {treatment.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-bold underline decoration-[#F29A9A] decoration-2 underline-offset-4">
          Lihat Selengkapnya
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
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </li>
  );
}

export function ResultsCarousel() {
  const { trackRef, page, pages, update, goTo } = useCarousel();

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="featured-heading"
      className="bg-white py-10 md:py-16"
    >
      <h2
        id="featured-heading"
        className="mx-auto mb-6 w-full max-w-6xl px-5 text-2xl font-bold tracking-tight text-[#1B1B7A] sm:text-3xl md:mb-8 md:px-8 md:text-4xl"
      >
        Treatment Unggulan
      </h2>
      <div className="relative px-5">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          aria-label="Treatment sebelumnya"
          className="absolute left-7 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 sm:grid md:left-8"
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

        <ul
          ref={trackRef}
          onScroll={update}
          tabIndex={0}
          aria-label="Daftar treatment unggulan"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] [&::-webkit-scrollbar]:hidden"
        >
          {featuredTreatments.map((t, i) => (
            <FeaturedSlide
              key={t.slug}
              treatment={t}
              label={`${i + 1} dari ${featuredTreatments.length}`}
            />
          ))}
        </ul>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= pages - 1}
          aria-label="Treatment berikutnya"
          className="absolute right-7 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 sm:grid md:right-8"
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

      <div
        className="mt-5 flex items-center justify-center md:mt-6"
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
}
