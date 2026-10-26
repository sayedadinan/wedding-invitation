import { wedding } from '../config/wedding';
import { formatEventDate } from '../lib/date';
import { useCountdown } from '../hooks/useCountdown';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';

function DaysToGo({ target }: { target: number }) {
  const { days, expired } = useCountdown(target);
  const text = expired ? 'Today, Alhamdulillah' : days === 0 ? 'Today, insha’Allah' : `${days} ${days === 1 ? 'day' : 'days'} to go`;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-3 py-1 text-xs font-semibold text-gold-text">
      <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
      {text}
    </span>
  );
}

/** Chronological list of the configured events; the main event is emphasised. */
export function Timeline() {
  const events = [...wedding.events].sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime));
  const main = events.find((e) => e.main) ?? events[0];
  const mainDate = main ? formatEventDate(main.dateTime, wedding.timeZone) : null;

  return (
    <section className="px-6 py-16 sm:px-12" aria-labelledby="plan-heading">
      <div className="mx-auto max-w-2xl">
        <SectionLabel index="02" label="Celebration plan" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <h2 id="plan-heading" className="font-display text-4xl font-light text-ink">
            The day
          </h2>
          {mainDate && <DaysToGo target={mainDate.timestamp} />}
        </div>

        <ol className="relative mt-8 space-y-6 border-l border-line pl-6">
          {events.map((event, i) => {
            const date = formatEventDate(event.dateTime, wedding.timeZone);
            const isMain = event === main;
            return (
              <li key={event.id} className="relative">
                <span
                  className={`absolute -left-[1.94rem] top-6 size-3 rounded-full border-2 ${
                    isMain ? 'border-wine bg-wine' : 'border-gold bg-paper'
                  }`}
                  aria-hidden="true"
                />
                <Reveal delay={i * 0.08}>
                  <article className={`rounded-2xl p-5 ${isMain ? 'bg-wine text-paper shadow-xl shadow-wine/20' : 'paper-card'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-3xl">{event.name}</h3>
                      {isMain && (
                        <span className="rounded-full bg-paper/15 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-paper">
                          Main event
                        </span>
                      )}
                    </div>
                    <p className={`mt-3 font-semibold ${isMain ? 'text-paper' : 'text-ink'}`}>
                      {date ? `${date.weekday}, ${date.date}` : 'Date to be announced'}
                    </p>
                    {date && <p className={isMain ? 'text-paper/80' : 'text-muted'}>{date.time}</p>}
                    <p className={`mt-3 text-sm ${isMain ? 'text-paper/85' : 'text-muted'}`}>
                      {event.venueName}
                      <br />
                      {event.address}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
