'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { getApiErrorMessage, getApiStatus } from '@/lib/api-error';
import { useRateAppointment } from '@/hooks/api/use-appointments';
import type { TAppointment } from '@/types/appointment';
import { card, errorText, inputBase, primaryBtn } from '@/lib/styles';

const MAX_REVIEW = 500; // sama dengan backend

type Props = { appointment: TAppointment };

export default function RatingForm({ appointment }: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [serverError, setServerError] = useState('');

  const rate = useRateAppointment({
    onError: (error) =>
      setServerError(
        getApiStatus(error) === 409
          ? 'Anda sudah memberi rating untuk reservasi ini.'
          : getApiErrorMessage(error, 'Gagal mengirim rating.'),
      ),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError('');
    if (!rating) {
      setRatingError('Pilih rating 1 sampai 5.');
      return;
    }
    rate.mutate({ id: appointment.id, body: { rating, review: review.trim() || undefined } });
  }

  return (
    <form
      id="rating"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="rating-heading"
      className={card}
    >
      <h2 id="rating-heading" className="text-xl font-bold text-[#1B1B7A]">
        Bagaimana konsultasi Anda?
      </h2>

      {serverError && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900"
        >
          {serverError}
        </div>
      )}

      <fieldset className="mt-4" aria-describedby={ratingError ? 'rating-error' : undefined}>
        <legend className="font-semibold">
          Beri rating untuk {appointment.doctors.full_name}
        </legend>
        {/* Radio asli agar bisa dipilih dengan tombol panah */}
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label
              key={star}
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#1B1B7A]"
            >
              <input
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                onChange={() => {
                  setRating(star);
                  setRatingError('');
                }}
                disabled={rate.isPending}
                className="sr-only"
              />
              <Star
                aria-hidden="true"
                className={`h-8 w-8 ${star <= rating ? 'fill-amber-500 text-amber-600' : 'text-neutral-500'}`}
              />
              <span className="sr-only">{star} bintang</span>
            </label>
          ))}
        </div>
        {ratingError && (
          <p id="rating-error" role="alert" className={errorText}>
            {ratingError}
          </p>
        )}
      </fieldset>

      <label htmlFor="review" className="mt-5 block font-semibold">
        Ulasan (opsional)
      </label>
      <textarea
        id="review"
        rows={4}
        maxLength={MAX_REVIEW}
        value={review}
        onChange={(event) => setReview(event.target.value)}
        disabled={rate.isPending}
        aria-describedby="review-count"
        className={`mt-2 ${inputBase} border-neutral-300`}
      />
      <p id="review-count" className="mt-1 text-right text-sm text-neutral-600">
        {review.length}/{MAX_REVIEW}
      </p>

      <button type="submit" disabled={rate.isPending} className={`mt-4 w-full sm:w-auto ${primaryBtn}`}>
        {rate.isPending ? 'Mengirim...' : 'Kirim rating'}
      </button>
    </form>
  );
}
