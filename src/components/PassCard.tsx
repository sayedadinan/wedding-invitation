import { CalendarDays, MapPin, Navigation, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';
import { formatEventDate } from '../lib/date';
import { mapsLink, phoneLink } from '../lib/links';
import { ease } from '../lib/motion';
import { CompactCountdown } from './Countdown';
import { Star } from './Ornament';

interface PassCardProps {
  guestName: string | null;
  count: number;
}

const actionBtn =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors';

/** Ticket-style invitation pass shown after a guest confirms. */
export function PassCard({ guestName, count }: PassCardProps) {
  const event = formatEventDate(wedding.event.dateTime, wedding.event.timeZone);
  const tel = phoneLink();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease }}
      className="relative mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-3xl border border-gold/50 bg-emerald text-left shadow-2xl shadow-black/40"
    >
      <div className="pattern px-6 pb-5 pt-6">
        <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-gold">
          <span>Invitation Pass</span>
          <Star size={16} />
        </div>
        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] text-ivory/50">Guest</p>
        <p className="break-words font-serif text-3xl text-ivory">{guestName ?? 'You'}</p>
        {count > 0 && (
          <p className="mt-0.5 text-sm text-ivory/65">
            {count} {count === 1 ? 'guest' : 'guests'}
          </p>
        )}
        <p className="mt-4 font-serif text-lg italic text-gold">
          {wedding.couple.bride} &amp; {wedding.couple.groom}
        </p>
      </div>

      {/* Perforation */}
      <div className="relative" aria-hidden="true">
        <span className="absolute left-0 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-forest" />
        <span className="absolute right-0 top-1/2 size-6 -translate-y-1/2 translate-x-1/2 rounded-full border border-gold/50 bg-forest" />
        <div className="mx-6 border-t border-dashed border-gold/40" />
      </div>

      <div className="space-y-4 px-6 pb-6 pt-5">
        <div className="flex gap-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <p className="text-ivory">{event ? `${event.weekday}, ${event.date}` : 'Date to be announced'}</p>
            {event && (
              <p className="text-sm text-ivory/60">
                {wedding.event.title} · {event.time}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <p className="text-ivory">{wedding.venue.name}</p>
            <p className="text-sm text-ivory/60">{wedding.venue.address}</p>
          </div>
        </div>
        {event && (
          <div className="rounded-2xl border border-gold/20 bg-forest/40 px-4 py-3 text-center">
            <CompactCountdown target={event.timestamp} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href={mapsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${actionBtn} bg-gold text-forest hover:bg-[#d4ba82]`}
          >
            <Navigation size={16} aria-hidden="true" />
            Location
          </a>
          {tel ? (
            <a href={tel} className={`${actionBtn} border border-gold/60 text-ivory hover:bg-gold/15`}>
              <Phone size={16} aria-hidden="true" />
              Call us
            </a>
          ) : (
            <span className={`${actionBtn} cursor-not-allowed border border-gold/25 text-ivory/40`} title="Phone number coming soon">
              <Phone size={16} aria-hidden="true" />
              Call us
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
