import { DAYS, DAY_ORDER, formatPracticeDays } from '@/lib/schedule';

type Props = { schedules: { day_of_week: number }[] };

// Strip Senin → Minggu: hari praktik dokter terlihat sekilas
export function PracticeWeek({ schedules }: Props) {
  const practiceDays = new Set(schedules.map((schedule) => schedule.day_of_week));

  return (
    <div>
      <p className="sr-only">Hari praktik: {formatPracticeDays(schedules)}</p>
      <ul aria-hidden="true" className="grid grid-cols-7 gap-1">
        {DAY_ORDER.map((day) => (
          <li
            key={day}
            className={`rounded-md py-1.5 text-center text-xs ${
              practiceDays.has(day)
                ? 'bg-[#1B1B7A] font-bold text-white'
                : 'bg-[#1B1B7A]/5 text-neutral-600'
            }`}
          >
            {DAYS[day].slice(0, 3)}
          </li>
        ))}
      </ul>
    </div>
  );
}
