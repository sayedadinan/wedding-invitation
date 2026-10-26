import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { mainEvent, wedding } from '../config/wedding';
import { formatEventDate } from '../lib/date';
import { ease } from '../lib/motion';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

interface CoverProps {
  guestName: string | null;
  onOpen: () => void;
}

/** Full-screen first page. Guests tap the button to turn to the details (music starts on that tap). */
export function Cover({ guestName, onOpen }: CoverProps) {
  const { bride, groom } = wedding.couple;
  const event = formatEventDate(mainEvent.dateTime, wedding.timeZone);
  const [brideFirst, ...brideRest] = bride.split(' ');

  return (
    <motion.section
      className="paper-bg fixed inset-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden px-6 pb-8 pt-7 sm:px-12"
      exit={{ opacity: 0, y: '-12%' }}
      transition={{ duration: 0.7, ease }}
      aria-label="Invitation cover"
    >
      {/* Hairline frame with gold corner ticks */}
      <div className="pointer-events-none fixed inset-3 border border-wine/15 sm:inset-5" aria-hidden="true">
        {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(
          (pos) => (
            <span key={pos} className={`absolute size-5 border-gold ${pos}`} />
          ),
        )}
      </div>

      {/* Date motif: oversized hollow day numeral */}
      {event && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="numeral-outline pointer-events-none absolute -right-4 top-16 select-none font-display text-[13rem] font-light leading-none opacity-30 sm:right-6 sm:text-[18rem]"
        >
          {event.day}
        </motion.span>
      )}

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <motion.div {...rise(0.05)} className="flex flex-wrap-reverse items-center justify-between gap-x-4 gap-y-2 pt-2">
          <span className="min-w-0 break-words text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">
            {guestName ? `For ${guestName}` : 'Wedding invitation'}
          </span>
          <span lang="ar" dir="rtl" className="ml-auto whitespace-nowrap font-arabic text-base text-gold-text" title={wedding.invitation.bismillahTransliteration}>
            {wedding.invitation.bismillah}
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.p {...rise(0.15)} className="max-w-[17rem] text-[0.95rem] leading-relaxed text-muted">
            {wedding.invitation.line}
          </motion.p>

          <h1 className="mt-7 font-display font-light text-wine">
            <motion.span {...rise(0.3)} className="block text-[4.2rem] leading-[0.95] sm:text-8xl">
              {brideFirst}
            </motion.span>
            {brideRest.length > 0 && (
              <motion.span {...rise(0.38)} className="block pl-10 text-[3.6rem] italic leading-[0.95] sm:pl-24 sm:text-8xl">
                {brideRest.join(' ')}
              </motion.span>
            )}
            <motion.span
              {...rise(0.5)}
              className="my-3 flex items-center gap-4 font-display text-5xl italic text-gold"
              aria-label="and"
            >
              <span className="h-px w-16 bg-gold/60 sm:w-24" aria-hidden="true" />
              &amp;
            </motion.span>
            <motion.span {...rise(0.6)} className="block text-right text-[4.2rem] italic leading-[0.95] sm:text-8xl">
              {groom}
            </motion.span>
          </h1>
        </div>

        <motion.div {...rise(0.8)} className="border-t border-wine/20 pt-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-text">When</dt>
              <dd className="mt-1 font-medium text-ink">
                {event ? (
                  <>
                    {event.weekday}, {event.time}
                    <br />
                    {event.date}
                  </>
                ) : (
                  'To be announced'
                )}
              </dd>
            </div>
            <div className="text-right">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-text">Where</dt>
              <dd className="mt-1 font-medium text-ink">
                {mainEvent.venueName}
                <br />
                <span className="text-muted">{mainEvent.address.split(',').slice(-2, -1)[0]?.trim() ?? mainEvent.address}</span>
              </dd>
            </div>
          </dl>

          <motion.button
            type="button"
            onClick={onOpen}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-wine px-6 text-[0.95rem] font-semibold text-paper shadow-lg shadow-wine/20 transition-colors hover:bg-wine-deep"
          >
            View celebration details
            <ArrowRight size={18} aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
