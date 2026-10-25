'use client';

import { treatments } from '@/components/user/landing-page/treatment';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { NAVY } from './constants';

const categories = [
  'Acne & Scar',
  'Brightening',
  'Anti-Aging',
  'Hair',
  'Slimming',
] as const;

type Category = (typeof categories)[number];

export function TreatmentTabs() {
  const [active, setActive] = useState<Category>('Acne & Scar');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = treatments.filter((t) => t.category === active);

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
    tabRefs.current[next]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-16">
      <h2
        className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl"
        style={{ color: NAVY }}
      >
        Temukan Perawatan Terbaik Sesuai Permasalahan Kulitmu
      </h2>
      <div
        role="tablist"
        aria-label="Kategori perawatan"
        className="-mx-5 mt-6 flex scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] scrollbar-none md:mx-0 md:mt-8 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
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
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] sm:text-base md:px-6 md:py-3 md:text-lg ${
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
      <div
        role="tabpanel"
        id="panel-treatments"
        aria-labelledby={`tab-${categories.indexOf(active)}`}
        tabIndex={0}
        className="mt-8 grid gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4"
      >
        {visible.map((t) => (
          <article
            key={t.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg md:rounded-3xl"
          >
            <div className="relative aspect-video w-full bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5 sm:aspect-4/3">
              {t.image && (
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <span
                className="absolute left-3 top-3 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide md:left-4 md:top-4 md:rounded-xl md:px-3 md:py-2"
                style={{ color: NAVY }}
              >
                {t.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3
                className="text-xl font-bold md:text-2xl"
                style={{ color: NAVY }}
              >
                {t.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-base md:mt-3">
                {t.description}
              </p>

              <Link
                href={`/treatment/${t.slug}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-[#1B1B7A] px-4 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] md:mt-6 md:rounded-2xl md:py-3.5"
              >
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
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="sr-only">: {t.title}</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
