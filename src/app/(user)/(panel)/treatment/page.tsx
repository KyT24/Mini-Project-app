import { MessageCircle } from 'lucide-react';
import { waLink } from '@/constants/contact';
import { categories, treatments } from '@/constants/treatments';
import {
  categoryIcons,
  TreatmentCard,
} from '@/components/user/treatment/treatment-card';

export const metadata = { title: 'Treatment' };

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

// id anchor per kategori, mis. "Acne & Scar" -> "acne-scar"
function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function TreatmentPage() {
  const grouped = categories.map((category) => ({
    category,
    items: treatments.filter((t) => t.category === category),
  }));

  return (
    <div className="bg-[#FAF8F3]">
      <header className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F29A9A]/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#1B1B7A]/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pb-14 md:pt-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963535]">
            {treatments.length} Perawatan · {categories.length} Kategori
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#1B1B7A] sm:text-4xl md:text-5xl">
            Perawatan yang dirancang untuk setiap kebutuhan kulitmu
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">
            Pilih kategori sesuai permasalahanmu, lalu lihat detail tiap
            treatment sebelum melakukan reservasi.
          </p>

          <nav aria-label="Lompat ke kategori" className="mt-8">
            <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {grouped.map(({ category, items }) => {
                const Icon = categoryIcons[category];
                return (
                  <li key={category} className="shrink-0">
                    <a
                      href={`#${categoryId(category)}`}
                      className={`flex min-h-11 items-center gap-2 rounded-full border border-[#1B1B7A]/15 bg-white px-5 py-2.5 font-semibold text-[#1B1B7A] transition-colors hover:border-[#1B1B7A] hover:bg-[#1B1B7A] hover:text-white ${FOCUS}`}
                    >
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      {category}
                      <span className="text-sm font-medium opacity-70">
                        ({items.length})
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-14 px-5 pb-16 md:space-y-20 md:px-8 md:pb-24">
        {grouped.map(({ category, items }) => {
          const Icon = categoryIcons[category];
          const id = categoryId(category);
          return (
            <section
              key={category}
              id={id}
              aria-labelledby={`${id}-heading`}
              className="scroll-mt-28"
            >
              <div className="flex items-center gap-4 border-b border-[#1B1B7A]/10 pb-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#1B1B7A] text-white">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id={`${id}-heading`}
                    className="text-2xl font-bold tracking-tight text-[#1B1B7A] md:text-3xl"
                  >
                    {category}
                  </h2>
                  <p className="text-neutral-600">{items.length} treatment</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-5 sm:grid-cols-2 md:mt-8 md:gap-6 lg:grid-cols-3">
                {items.map((t, i) => (
                  <li key={t.slug}>
                    <TreatmentCard treatment={t} index={i} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <aside className="relative overflow-hidden rounded-3xl bg-[#1B1B7A] px-6 py-10 text-white md:px-12 md:py-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F29A9A]/30 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Masih bingung memilih treatment?
              </h2>
              <p className="mt-3 leading-relaxed text-white/90">
                Konsultasikan kondisi kulitmu dengan tim kami sebelum melakukan
                reservasi.
              </p>
            </div>
            <a
              href={waLink('Halo, saya ingin konsultasi memilih treatment.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-[#1B1B7A] transition-colors hover:bg-[#FAF8F3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Konsultasi via WhatsApp
              <span className="sr-only"> (membuka tab baru)</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
