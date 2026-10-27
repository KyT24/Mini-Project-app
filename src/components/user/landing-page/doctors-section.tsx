import { DoctorList } from '@/components/user/landing-page/doctor';
import { waLink } from './constants';

export function DoctorsSection() {
  return (
    <section
      aria-labelledby="doctors-heading"
      className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-16"
    >
      <h2
        id="doctors-heading"
        className="text-2xl font-bold tracking-tight text-[#1B1B7A] sm:text-3xl md:text-4xl"
      >
        Dokter Senior Kami
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
        Perawatan ditangani langsung oleh dokter berpengalaman yang siap
        membantu mengenali kebutuhan kulitmu.
      </p>
      <DoctorList waLink={waLink} />
    </section>
  );
}
