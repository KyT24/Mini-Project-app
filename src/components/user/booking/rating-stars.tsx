import { Star } from 'lucide-react';

type Props = { value: number; size?: 'sm' | 'md' };

// Tampilan bintang read-only; nilai dibacakan sekali untuk screen reader
export default function RatingStars({ value, size = 'sm' }: Props) {
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <span role="img" aria-label={`Rating ${value} dari 5`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={`${icon} ${star <= value ? 'fill-amber-500 text-amber-600' : 'text-neutral-400'}`}
        />
      ))}
    </span>
  );
}
