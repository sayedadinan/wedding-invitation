/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — edit this file only.
 *  Values in [square brackets] are placeholders still to be filled in.
 *  Never put passwords or secret keys here: everything in this file is public.
 * ─────────────────────────────────────────────────────────────
 */

export interface WeddingEvent {
  id: string;
  name: string;
  /** ISO date-time with the venue's UTC offset. India = +05:30. */
  dateTime: string;
  /** Leave null if the end time isn't known; the calendar file then only sets a start time. */
  durationMinutes: number | null;
  venueName: string;
  address: string;
  /** Google Maps share link. If empty, a search link is built from the venue + address. */
  mapsUrl: string;
  /** The highlighted event (shown on the cover and venue section). */
  main?: boolean;
}

export interface MealOption {
  /** Stable id sent to the sheet — must match MEALS in apps-script/Code.gs. */
  id: string;
  label: string;
}

const events: WeddingEvent[] = [
  {
    id: 'nikah',
    name: 'Nikah',
    dateTime: '2027-01-29T11:00:00+05:30',
    durationMinutes: null,
    venueName: '[Auditorium Name]',
    address: 'Beypore, Kozhikode, Kerala',
    mapsUrl: 'https://maps.app.goo.gl/eu4yMNxkELA6tiav6',
    main: true,
  },
];

const meals: MealOption[] = [
  { id: 'beef-biriyani', label: 'Beef biriyani' },
  { id: 'neychoru-stew', label: 'Neychoru + stew curry' },
];

export const wedding = {
  couple: {
    bride: 'Nidha Fathima',
    groom: "[Groom's Name]",
  },

  timeZone: 'Asia/Kolkata',
  events,

  invitation: {
    bismillah: 'بسم الله الرحمن الرحيم',
    bismillahTransliteration: 'Bismillahir Rahmanir Raheem',
    line: 'With the blessings of Allah, we joyfully invite you to celebrate the wedding of',
    presence: 'Your presence and duas would make our celebration even more special.',
    verse: 'And He placed between you affection and mercy.',
    verseReference: 'Surah Ar-Rum 30:21',
    closing: 'We look forward to celebrating this special occasion with you.',
    familySignOff: 'With love, the families of',
  },

  contact: {
    // Shown as a "Call for details" button. Include the country code.
    phone: '[+91 XXXXX XXXXX]',
  },

  rsvp: {
    // Public Apps Script URL (ends with /exec). Prefer setting VITE_RSVP_ENDPOINT in .env.local / Netlify.
    endpoint: import.meta.env.VITE_RSVP_ENDPOINT ?? '',
    // While no endpoint is set, the form runs as a clearly labelled demo (nothing is sent).
    demoMode: true,
    maxAttendees: 15,
    meals,
    mealNote: 'ആദ്യം വരുമെന്ന് പറയൂ… ഭക്ഷണം നമുക്ക് സെറ്റ് ചെയ്യാം 😄',
  },

  audio: {
    // Path inside /public. Never autoplays — only plays when the guest taps the music button. '' disables it.
    src: '/audio/nasheed.mp3',
    volume: 0.5,
  },

  theme: {
    paper: '#FBF6EE',
    paperDeep: '#F3E9DA',
    wine: '#5C1626',
    wineDeep: '#3B0D18',
    ink: '#2B1A1D',
    muted: '#6B5358',
    gold: '#B48A4A',
    goldText: '#8A6530', // darker gold for text on ivory (readable contrast)
    line: '#E3D3BC',
  },
} as const;

export type WeddingConfig = typeof wedding;

export const isPlaceholder = (value: string) => /^\s*\[.*\]\s*$/.test(value);

export const mainEvent: WeddingEvent = events.find((e) => e.main) ?? events[0];
