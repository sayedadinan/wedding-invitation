import { AnimatePresence, motion } from 'framer-motion';
import { mainEvent, wedding } from '../config/wedding';
import { formatEventDate } from '../lib/date';
import { useCountdown } from '../hooks/useCountdown';

const pad = (n: number) => String(n).padStart(2, '0');

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-paper px-1 py-2.5">
      <span className="relative h-8 overflow-hidden font-display text-[1.65rem] leading-8 tabular-nums text-wine">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
    </div>
  );
}

/** Live countdown to the main event, with its date and time. */
export function CountdownStrip() {
  const event = formatEventDate(mainEvent.dateTime, wedding.timeZone);
  const { days, hours, minutes, seconds, expired } = useCountdown(event?.timestamp ?? NaN);
  if (!event) return null;

  return (
    <div className="rounded-2xl border border-gold/50 bg-gold/10 p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-text">
        {expired ? 'The day is here' : `Counting down to the ${mainEvent.name}`}
      </p>
      <p className="mt-1 font-semibold text-ink">
        {event.weekday}, {event.date} · <span className="whitespace-nowrap">{event.time}</span>
      </p>
      {!expired && (
        <div
          className="mt-3 grid grid-cols-4 gap-2"
          role="timer"
          aria-label={`${days} days, ${hours} hours, ${minutes} minutes to go`}
        >
          <Unit value={String(days)} label="Days" />
          <Unit value={pad(hours)} label="Hours" />
          <Unit value={pad(minutes)} label="Mins" />
          <Unit value={pad(seconds)} label="Secs" />
        </div>
      )}
    </div>
  );
}
