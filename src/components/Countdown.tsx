import { AnimatePresence, motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';

const pad = (n: number) => String(n).padStart(2, '0');

/** Number that slides up whenever it changes. */
function Ticker({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '70%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-70%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Ring({ value, display, max, label }: { value: number; display: string; max: number; label: string }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(1, value / max);
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-[4.3rem] sm:size-20">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/15" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gold"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Ticker value={display} className="font-serif text-2xl text-ivory sm:text-3xl" />
        </div>
      </div>
      <span className="mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold/90">{label}</span>
    </div>
  );
}

export function Countdown({ target }: { target: number }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);

  if (expired) {
    return <p className="font-serif text-2xl italic text-gold">Alhamdulillah, the blessed day has arrived.</p>;
  }

  return (
    <div role="timer" aria-label={`${days} days, ${hours} hours and ${minutes} minutes to go`}>
      <p className="mb-4 font-serif text-lg italic text-ivory/80" aria-hidden="true">
        {days > 0 ? (
          <>
            Only <span className="text-gold">{days}</span> {days === 1 ? 'day' : 'days'} until two hearts unite
          </>
        ) : (
          'Today, insha’Allah, two hearts unite'
        )}
      </p>
      <div className="flex justify-center gap-2.5 sm:gap-5" aria-hidden="true">
        <Ring value={days} display={String(days)} max={365} label="Days" />
        <Ring value={hours} display={pad(hours)} max={24} label="Hours" />
        <Ring value={minutes} display={pad(minutes)} max={60} label="Mins" />
        <Ring value={seconds} display={pad(seconds)} max={60} label="Secs" />
      </div>
    </div>
  );
}

/** Single-line countdown for the invitation pass. */
export function CompactCountdown({ target }: { target: number }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);
  if (expired) return <span className="text-gold">Today, Alhamdulillah</span>;
  const parts: [string, string][] = [
    [String(days), 'd'],
    [pad(hours), 'h'],
    [pad(minutes), 'm'],
    [pad(seconds), 's'],
  ];
  return (
    <span className="inline-flex items-baseline gap-2 font-serif text-xl text-ivory">
      {parts.map(([v, unit]) => (
        <span key={unit} className="inline-flex items-baseline">
          <Ticker value={v} />
          <span className="ml-0.5 font-sans text-xs text-gold">{unit}</span>
        </span>
      ))}
    </span>
  );
}
