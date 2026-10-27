'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  categories,
  treatments,
  type Category,
} from '@/components/user/landing-page/treatment';
import {
  categoryIcons,
  TreatmentCard,
} from '@/components/user/treatment/treatment-card';
import { NAVY } from './constants';

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
          const Icon = categoryIcons[c];
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
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] sm:text-base md:px-6 md:py-3 md:text-lg ${
                selected
                  ? 'border-[#1B1B7A] bg-[#1B1B7A] text-white shadow-md'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-[#1B1B7A] hover:text-[#1B1B7A]'
              }`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
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
        {visible.map((t, i) => (
          <TreatmentCard key={t.slug} treatment={t} index={i} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/treatment"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#1B1B7A] px-6 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#1B1B7A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
        >
          Lihat Semua Treatment
        </Link>
      </div>
    </section>
  );
}
