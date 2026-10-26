import { wedding, type WeddingEvent } from '../config/wedding';
import { mapsLink } from './links';

const toIcsDate = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (text: string) => text.replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

/** Builds an .ics file from the configured event. Only includes an end time when one is configured. */
export function buildIcs(event: WeddingEvent): string | null {
  const start = Date.parse(event.dateTime);
  if (Number.isNaN(start)) return null;
  const { bride, groom } = wedding.couple;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//nidha-wedding//invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${start}@nidha-wedding`,
    `DTSTAMP:${toIcsDate(Date.now())}`,
    `DTSTART:${toIcsDate(start)}`,
    ...(event.durationMinutes ? [`DTEND:${toIcsDate(start + event.durationMinutes * 60_000)}`] : []),
    `SUMMARY:${escape(`${event.name} — ${bride} & ${groom}`)}`,
    `LOCATION:${escape(`${event.venueName}, ${event.address}`)}`,
    `DESCRIPTION:${escape(`Directions: ${mapsLink(event)}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadIcs(event: WeddingEvent): boolean {
  const ics = buildIcs(event);
  if (!ics) return false;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}-invitation.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
