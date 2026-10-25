import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTreatmentBySlug,
  treatments,
} from '@/components/user/landing-page/treatment';

const primaryBtn =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#1B1B7A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12125c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

const linkClass =
  'font-semibold text-[#1B1B7A] underline decoration-[#F29A9A] decoration-2 underline-offset-4 hover:text-[#d96a6a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]';

// Semua slug di-prerender saat build
export function generateStaticParams() {
  return treatments.map((t) => ({ treatmentSlug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/treatment/[treatmentSlug]'>) {
  const { treatmentSlug } = await params;
  const treatment = getTreatmentBySlug(treatmentSlug);
  return { title: treatment ? treatment.title : 'Treatment tidak ditemukan' };
}

export default async function TreatmentDetailPage({
  params,
}: PageProps<'/treatment/[treatmentSlug]'>) {
  const { treatmentSlug } = await params;
  const treatment = getTreatmentBySlug(treatmentSlug);

  if (!treatment) notFound();

  // Treatment lain di kategori yang sama
  const related = treatments.filter(
    (t) => t.category === treatment.category && t.slug !== treatment.slug,
  );

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className={linkClass}
        >
          Kembali ke beranda
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <div className="relative aspect-video w-full bg-linear-to-br from-[#1B1B7A]/15 to-[#1B1B7A]/5">
            {treatment.image && (
              <img
                src={treatment.image}
                alt={treatment.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="p-6 md:p-10">
            <span className="w-fit rounded-full bg-[#1B1B7A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1B1B7A]">
              {treatment.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1B1B7A] md:text-5xl">
              {treatment.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">
              {treatment.description}
            </p>

            <Link
              href={`/treatment/${treatment.slug}/booking`}
              className={`mt-8 ${primaryBtn}`}
            >
              Reservasi Sekarang
              <span className="sr-only"> {treatment.title}</span>
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section
            aria-labelledby="related-title"
            className="mt-10"
          >
            <h2
              id="related-title"
              className="text-2xl font-bold tracking-tight text-[#1B1B7A]"
            >
              Treatment {treatment.category} lainnya
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/treatment/${t.slug}`}
                    className="block h-full rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                  >
                    <span className="text-lg font-bold text-[#1B1B7A]">
                      {t.title}
                    </span>
                    <span className="mt-1 block text-neutral-600">
                      {t.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
