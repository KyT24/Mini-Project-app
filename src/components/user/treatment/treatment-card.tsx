import Link from 'next/link';
import {
  ArrowUpRight,
  Hourglass,
  PersonStanding,
  ScanFace,
  Sun,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { Category, Treatment } from '@/constants/treatments';
import { formatRupiah } from '@/lib/format';

export const categoryIcons: Record<Category, LucideIcon> = {
  'Acne & Scar': ScanFace,
  Brightening: Sun,
  'Anti-Aging': Hourglass,
  Hair: Wind,
  Slimming: PersonStanding,
};

type Props = {
  treatment: Treatment;
  index: number;
};

export function TreatmentCard({ treatment, index }: Props) {
  const Icon = categoryIcons[treatment.category];

  return (
    <Link
      href={`/treatment/${treatment.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#1B1B7A]/30 hover:shadow-[0_18px_40px_-20px_rgba(27,27,122,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7"
    >
      {/* Aksen lembut pengganti foto */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#F29A9A]/20 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[#1B1B7A]/5 blur-2xl"
      />

      <div className="relative flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1B1B7A]/5 text-[#1B1B7A] ring-1 ring-[#1B1B7A]/10 transition-colors duration-300 group-hover:bg-[#1B1B7A] group-hover:text-white">
          <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-sm font-semibold tracking-widest text-[#1B1B7A]/30"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <span className="relative mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#963535]">
        {treatment.category}
      </span>
      <h3 className="relative mt-2 text-xl font-bold tracking-tight text-[#1B1B7A] md:text-2xl">
        {treatment.title}
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-base">
        {treatment.description}
      </p>

      <span className="relative mt-6 flex items-center justify-between border-t border-dashed border-neutral-200 pt-5 text-[#1B1B7A]">
        <span>
          <span className="block text-sm text-neutral-600">Harga</span>
          <span className="text-lg font-bold">{formatRupiah(treatment.price)}</span>
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-[#1B1B7A]/20 transition-colors duration-300 group-hover:border-[#1B1B7A] group-hover:bg-[#1B1B7A] group-hover:text-white">
          <ArrowUpRight
            size={18}
            strokeWidth={2.25}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
          />
        </span>
      </span>
    </Link>
  );
}
