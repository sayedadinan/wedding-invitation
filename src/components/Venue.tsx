import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus, MapPin, Navigation, Phone } from 'lucide-react';
import { mainEvent } from '../config/wedding';
import { googleCalendarUrl, ICS_PATH } from '../lib/calendar';
import { mapsLink, phoneLink } from '../lib/links';
import { ease } from '../lib/motion';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';

const secondaryBtn =
  'inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-wine/40 px-3 text-[0.8rem] font-semibold text-wine transition-colors hover:bg-wine/5';

export function Venue() {
  const tel = phoneLink();
  const google = googleCalendarUrl(mainEvent);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <section className="px-6 py-16 sm:px-12" aria-labelledby="venue-heading">
      <div className="mx-auto max-w-2xl">
        <SectionLabel index="03" label="Venue & directions" />

        <Reveal className="paper-card mt-8 rounded-3xl p-6">
          <MapPin className="text-gold" size={26} strokeWidth={1.5} aria-hidden="true" />
          <h2 id="venue-heading" className="mt-4 font-display text-3xl text-ink">
            {mainEvent.venueName}
          </h2>
          <address className="mt-2 not-italic leading-relaxed text-muted">{mainEvent.address}</address>

          <a
            href={mapsLink(mainEvent)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-wine px-6 font-semibold text-paper transition-colors hover:bg-wine-deep"
          >
            <Navigation size={18} aria-hidden="true" />
            Get directions
          </a>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={secondaryBtn}
              aria-expanded={calendarOpen}
              aria-controls="calendar-options"
              onClick={() => setCalendarOpen((o) => !o)}
            >
              <CalendarPlus size={17} aria-hidden="true" />
              Add to calendar
            </button>
            {tel ? (
              <a href={tel} className={secondaryBtn}>
                <Phone size={17} aria-hidden="true" />
                Call for details
              </a>
            ) : (
              <span className={`${secondaryBtn} cursor-not-allowed border-line text-muted/60 hover:bg-transparent`}>
                <Phone size={17} aria-hidden="true" />
                Call for details
              </span>
            )}
          </div>

          <AnimatePresence initial={false}>
            {calendarOpen && (
              <motion.div
                id="calendar-options"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid gap-2 rounded-2xl bg-paper p-3">
                  {google && (
                    <a href={google} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
                      Google Calendar <span className="font-normal text-muted">· Android</span>
                    </a>
                  )}
                  <a href={ICS_PATH} className={secondaryBtn}>
                    Apple / Outlook <span className="font-normal text-muted">· iPhone</span>
                  </a>
                  <p className="px-1 pt-1 text-xs leading-relaxed text-muted">
                    {google
                      ? 'Google adds the Nikah. The Apple / Outlook file adds every event, with a reminder the day before.'
                      : 'Adds every event, with a reminder the day before.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
