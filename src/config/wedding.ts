/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — edit this file only.
 *  Never put passwords or secret keys here: everything in this file is public.
 *
 *  NOTE: the couple, dates, venue and phone below are SAMPLE content for a
 *  promo video. Replace them before sending the link to real guests.
 * ─────────────────────────────────────────────────────────────
 */

export interface WeddingEvent {
  id: string;
  name: string;
  /** ISO date-time with the venue's UTC offset. India = +05:30. */
  dateTime: string;
  /** Used for the calendar entry's end time. Leave null if unknown (Google Calendar option is then hidden). */
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
  /** Which illustration to show. */
  art: 'biriyani' | 'neychoru';
}

const events: WeddingEvent[] = [
  {
    id: 'mylanchi',
    name: 'Mylanchi Night',
    dateTime: '2027-02-06T19:00:00+05:30',
    durationMinutes: 180,
    venueName: "Bride's Residence",
    address: 'Feroke, Kozhikode, Kerala',
    mapsUrl: '',
  },
  {
    id: 'nikah',
    name: 'Nikah',
    dateTime: '2027-02-07T11:00:00+05:30',
    durationMinutes: 90,
    venueName: 'K Hills Auditorium',
    address: 'Ramanattukara, Kozhikode, Kerala',
    mapsUrl: '',
    main: true,
  },
  {
    id: 'reception',
    name: 'Wedding Lunch',
    dateTime: '2027-02-07T12:30:00+05:30',
    durationMinutes: 150,
    venueName: 'K Hills Auditorium',
    address: 'Ramanattukara, Kozhikode, Kerala',
    mapsUrl: '',
  },
];

const meals: MealOption[] = [
  { id: 'beef-biriyani', label: 'Beef biriyani', art: 'biriyani' },
  { id: 'neychoru-stew', label: 'Neychoru + stew curry', art: 'neychoru' },
];

export const wedding = {
  couple: {
    bride: 'Aysha',
    groom: 'Azhar',
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
    // Shown as a "Call for details" button. Include the country code. (Sample number — replace.)
    phone: '+91 98765 43210',
  },

  rsvp: {
    // Public Apps Script URL (ends with /exec). Prefer setting VITE_RSVP_ENDPOINT in .env.local / Netlify.
    endpoint: import.meta.env?.VITE_RSVP_ENDPOINT ?? '',
    // While no endpoint is set, submissions show the normal thank-you screen WITHOUT saving anything.
    // Fine for a promo video; set to false before sharing with real guests.
    demoMode: true,
    maxAttendees: 15,
    meals,
    mealNote: 'ആദ്യം വരുമെന്ന് പറയൂ… ഭക്ഷണം നമുക്ക് സെറ്റ് ചെയ്യാം 😄',
  },

  audio: {
    // Path inside /public. Starts when the guest taps "View celebration details". '' disables it.
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
