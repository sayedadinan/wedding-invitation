import { wedding, type WeddingEvent } from '../config/wedding';
import { mapsLink } from './links';

/** Path of the calendar file generated at build time (see vite.config.ts). */
export const ICS_PATH = '/wedding.ics';

const toUtcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (text: string) => text.replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
const title = (event: WeddingEvent) => `${event.name} — ${wedding.couple.bride} & ${wedding.couple.groom}`;

/** One .ics file containing every configured event, each with a reminder the day before. */
export function buildIcs(events: readonly WeddingEvent[] = wedding.events): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding-invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const event of events) {
    const start = Date.parse(event.dateTime);
    if (Number.isNaN(start)) continue;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}-${start}@wedding-invitation`,
      `DTSTAMP:${toUtcStamp(Date.now())}`,
      `DTSTART:${toUtcStamp(start)}`,
      ...(event.durationMinutes ? [`DTEND:${toUtcStamp(start + event.durationMinutes * 60_000)}`] : []),
      `SUMMARY:${escape(title(event))}`,
      `LOCATION:${escape(`${event.venueName}, ${event.address}`)}`,
      `DESCRIPTION:${escape(`Directions: ${mapsLink(event)}`)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escape(title(event))}`,
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/** Google Calendar "add event" link. Needs an end time, so returns null without a duration. */
export function googleCalendarUrl(event: WeddingEvent): string | null {
  const start = Date.parse(event.dateTime);
  if (Number.isNaN(start) || !event.durationMinutes) return null;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title(event),
    dates: `${toUtcStamp(start)}/${toUtcStamp(start + event.durationMinutes * 60_000)}`,
    location: `${event.venueName}, ${event.address}`,
    details: `Directions: ${mapsLink(event)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
