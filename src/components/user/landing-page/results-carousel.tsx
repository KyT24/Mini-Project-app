'use client';

import { useCarousel } from './use-carousel';

function ResultSlide({
  title,
  image,
  label,
}: {
  title: string;
  image: string;
  label: string;
}) {
  return (
    <li
      aria-roledescription="slide"
      aria-label={label}
      className="relative aspect-5/3 w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#14188f] sm:w-[calc((100%-1rem)/2)] md:rounded-3xl lg:w-[calc((100%-2rem)/3)]"
    >
      <img
        src={image}
        alt={`Hasil ${title}, sebelum dan sesudah`}
        loading="lazy"
        className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
      />
      <span className="absolute bottom-[20%] left-0 rounded-tr-lg bg-[#E9DFCB] px-3 py-1 text-sm font-medium text-[#1B1B7A] md:rounded-tr-xl md:px-4 md:py-1.5 md:text-base">
        Before
      </span>
      <span className="absolute bottom-[20%] left-1/2 rounded-t-lg bg-[#E9DFCB] px-3 py-1 text-sm font-medium text-[#1B1B7A] md:rounded-t-xl md:px-4 md:py-1.5 md:text-base">
        After
      </span>
      <p className="absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center bg-linear-to-b from-[#0f1258] to-[#14188f] px-3 text-center font-serif text-lg font-semibold text-white sm:text-xl xl:text-2xl">
        {title}
      </p>
    </li>
  );
}

export function ResultsCarousel() {
  const { trackRef, page, pages, update, goTo } = useCarousel();

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Hasil perawatan sebelum dan sesudah"
      className="bg-white py-10 md:py-16"
    >
      <div className="relative px-5">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          aria-label="Hasil sebelumnya"
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
          aria-label="Daftar hasil perawatan"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] [&::-webkit-scrollbar]:hidden"
        >
          <ResultSlide
            title="Hair Grow Combo"
            image="/results/hair-grow-combo.jpg"
            label="1 dari 6"
          />
          <ResultSlide
            title="Pink Lips"
            image="/results/pink-lips.jpg"
            label="2 dari 6"
          />
          <ResultSlide
            title="Laser Co2"
            image="/results/laser-co2.jpg"
            label="3 dari 6"
          />
          <ResultSlide
            title="Brightening"
            image="/results/brightening.jpg"
            label="4 dari 6"
          />
          <ResultSlide
            title="Acne Facial"
            image="/results/acne-facial.jpg"
            label="5 dari 6"
          />
          <ResultSlide
            title="Body Slimming"
            image="/results/body-slimming.jpg"
            label="6 dari 6"
          />
        </ul>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= pages - 1}
          aria-label="Hasil berikutnya"
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
