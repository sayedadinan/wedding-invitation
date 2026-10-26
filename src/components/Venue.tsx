import { useState } from 'react';
import { CalendarPlus, MapPin, Navigation, Phone } from 'lucide-react';
import { mainEvent } from '../config/wedding';
import { downloadIcs } from '../lib/calendar';
import { mapsLink, phoneLink } from '../lib/links';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';

const secondaryBtn =
  'inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-wine/40 px-3 text-[0.8rem] font-semibold text-wine transition-colors hover:bg-wine/5';

export function Venue() {
  const tel = phoneLink();
  const [calendarFailed, setCalendarFailed] = useState(false);

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
            <button type="button" className={secondaryBtn} onClick={() => setCalendarFailed(!downloadIcs(mainEvent))}>
              <CalendarPlus size={17} aria-hidden="true" />
              Add to calendar
            </button>
            {tel ? (
              <a href={tel} className={secondaryBtn}>
                <Phone size={17} aria-hidden="true" />
                Call for details
              </a>
            ) : (
              <span
                className={`${secondaryBtn} cursor-not-allowed border-line text-muted/60 hover:bg-transparent`}
                title="Phone number coming soon"
              >
                <Phone size={17} aria-hidden="true" />
                Call for details
              </span>
            )}
          </div>
          {calendarFailed && (
            <p className="mt-3 text-sm text-wine" role="alert">
              Sorry, the calendar file couldn’t be created.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
