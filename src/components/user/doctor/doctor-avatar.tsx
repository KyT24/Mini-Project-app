import { getInitials } from '@/lib/format';
import type { TDoctor } from '@/types/doctor';

type Props = {
  doctor: Pick<TDoctor, 'full_name' | 'photo' | 'users'>;
  /** Ukuran kotak & teks inisial, mis. "h-16 w-16 text-xl" */
  className: string;
};

// Foto dokter; bila belum ada, tampilkan inisial nama
export function DoctorAvatar({ doctor, className }: Props) {
  const image = doctor.photo ?? doctor.users?.profile_picture;

  return (
    <div className={`shrink-0 overflow-hidden rounded-2xl bg-[#1B1B7A]/10 ${className}`}>
      {image ? (
        <img
          src={image}
          alt={`Foto ${doctor.full_name}`}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-bold text-[#1B1B7A]"
        >
          {getInitials(doctor.full_name)}
        </span>
      )}
    </div>
  );
}
