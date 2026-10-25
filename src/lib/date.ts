export interface EventDate {
  timestamp: number;
  weekday: string;
  date: string;
  time: string;
}

/** Formats the configured event in the venue's time zone. Returns null if the config is invalid. */
export function formatEventDate(iso: string, timeZone: string): EventDate | null {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return null;
  try {
    const d = new Date(timestamp);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat('en-GB', { timeZone, ...opts }).format(d);
    return {
      timestamp,
      weekday: fmt({ weekday: 'long' }),
      date: fmt({ day: 'numeric', month: 'long', year: 'numeric' }),
      time: fmt({ hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase(),
    };
  } catch {
    return null;
  }
}
