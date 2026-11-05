import Link from 'next/link';
import { categories, treatments } from '@/constants/treatments';
import { formatRupiah } from '@/lib/format';

export const metadata = { title: 'Treatment' };

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

// id anchor per kategori, mis. "Acne & Scar" -> "acne-scar"
function categoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function TreatmentPage() {
  const grouped = categories.map((category) => ({
    category,
    items: treatments.filter((treatment) => treatment.category === category),
  }));

  return (
    <div className="bg-[#FAF8F3]">
      <header className="mx-auto w-full max-w-6xl px-5 pb-8 pt-10 md:px-8 md:pb-12 md:pt-16">
        <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#1B1B7A] sm:text-4xl md:text-5xl">
          Perawatan untuk setiap kebutuhan kulitmu
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">
          {treatments.length} treatment dalam {categories.length} kategori. Pilih
          sesuai permasalahanmu, baca detailnya, lalu reservasi.
        </p>

        <nav aria-label="Lompat ke kategori" className="mt-8 md:mt-10">
          <ul className="-mx-5 flex gap-x-6 overflow-x-auto border-b border-[#1B1B7A]/15 px-5 md:mx-0 md:gap-x-8 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {grouped.map(({ category, items }) => (
              <li key={category} className="shrink-0">
                <a
                  href={`#${categoryId(category)}`}
                  className={`-mb-px flex min-h-11 items-center gap-1.5 border-b-2 border-transparent font-semibold text-[#1B1B7A] transition-colors hover:border-[#963535] ${FOCUS}`}
                >
                  {category}
                  <span className="text-sm font-medium text-neutral-600">
                    {items.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        {grouped.map(({ category, items }) => {
          const id = categoryId(category);
          return (
            <section
              key={category}
              id={id}
              aria-labelledby={`${id}-heading`}
              className="scroll-mt-20 border-t border-[#1B1B7A]/15 py-8 first:border-t-0 md:py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12"
            >
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2
                  id={`${id}-heading`}
                  className="text-2xl font-bold tracking-tight text-[#1B1B7A] md:text-3xl"
                >
                  {category}
                </h2>
                <p className="mt-1 text-neutral-600">{items.length} treatment</p>
              </div>

              <ul className="mt-5 grid md:grid-cols-2 md:gap-x-10 lg:mt-0 lg:grid-cols-1">
                {items.map((treatment) => (
                  <li
                    key={treatment.slug}
                    className="border-b border-neutral-300/70 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0 lg:border-b lg:last:border-b-0 lg:[&:nth-last-child(2):nth-child(odd)]:border-b"
                  >
                    <Link
                      href={`/treatment/${treatment.slug}`}
                      className={`group -mx-3 block rounded-lg px-3 py-5 transition-colors hover:bg-white ${FOCUS}`}
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <h3 className="text-lg font-bold text-[#1B1B7A] group-hover:underline group-hover:underline-offset-4 md:text-xl">
                          {treatment.title}
                        </h3>
                        <span className="shrink-0 font-semibold text-[#963535]">
                          {formatRupiah(treatment.price)}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-neutral-700 sm:text-base">
                        {treatment.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
