import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTreatmentBySlug, treatments } from '@/constants/treatments';
import { categoryIcons } from '@/components/user/treatment/treatment-card';
import { formatRupiah } from '@/lib/format';
import { linkClass, primaryBtn } from '@/lib/styles';

// Semua slug di-prerender saat build
export function generateStaticParams() {
  return treatments.map((treatment) => ({ treatmentSlug: treatment.slug }));
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

  const Icon = categoryIcons[treatment.category];

  // Treatment lain di kategori yang sama
  const related = treatments.filter(
    (item) => item.category === treatment.category && item.slug !== treatment.slug,
  );

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/treatment"
          className={linkClass}
        >
          Kembali ke daftar treatment
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <div className="relative flex h-40 items-center overflow-hidden bg-[#1B1B7A] px-6 md:h-56 md:px-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F29A9A]/30 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            />
            <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-white/10 text-white ring-1 ring-white/20 md:h-24 md:w-24">
              <Icon size={44} strokeWidth={1.5} aria-hidden="true" />
            </span>
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

            <dl className="mt-6 w-fit rounded-2xl bg-[#FAF8F3] px-5 py-4">
              <dt className="text-sm text-neutral-600">Harga treatment</dt>
              <dd className="text-2xl font-bold text-[#1B1B7A]">
                {formatRupiah(treatment.price)}
              </dd>
              <dd className="mt-1 text-sm text-neutral-600">
                Belum termasuk biaya konsultasi dokter
              </dd>
            </dl>

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
              {related.map((relatedTreatment) => (
                <li key={relatedTreatment.slug}>
                  <Link
                    href={`/treatment/${relatedTreatment.slug}`}
                    className="block h-full rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
                  >
                    <span className="text-lg font-bold text-[#1B1B7A]">
                      {relatedTreatment.title}
                    </span>
                    <span className="mt-1 block text-neutral-600">
                      {relatedTreatment.description}
                    </span>
                    <span className="mt-3 block font-semibold text-neutral-900">
                      {formatRupiah(relatedTreatment.price)}
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
