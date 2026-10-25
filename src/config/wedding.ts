/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — edit this file only.
 *  Values in [square brackets] are placeholders still to be filled in.
 *  Never put passwords or secret keys here: everything in this file is public.
 * ─────────────────────────────────────────────────────────────
 */

export const wedding = {
  couple: {
    bride: 'Nidha Fathima',
    groom: "[Groom's Name]",
  },

  event: {
    title: 'Nikah',
    // ISO date-time with the venue's UTC offset. India = +05:30.
    dateTime: '2027-01-29T11:00:00+05:30',
    timeZone: 'Asia/Kolkata',
  },

  venue: {
    name: '[Auditorium Name]',
    address: 'Beypore, Kozhikode, Kerala',
    // A Google Maps share link. If left empty, a search link is built from the name + address.
    mapsUrl: 'https://maps.app.goo.gl/eu4yMNxkELA6tiav6',
  },

  contact: {
    // Shown on the invitation pass as a "Call" button. Include the country code.
    phone: '[+91 XXXXX XXXXX]',
  },

  verse: {
    text: 'And He placed between you affection and mercy.',
    reference: 'Surah Ar-Rum 30:21',
  },

  familySignOff: 'With love, the families of',

  rsvp: {
    // Public Apps Script URL (ends with /exec). Prefer setting VITE_RSVP_ENDPOINT in .env.local / Netlify.
    endpoint: import.meta.env.VITE_RSVP_ENDPOINT ?? '',
    // DEMO ONLY: while no endpoint is set, show success without saving anything.
    // Set to false before sending links to real guests.
    demoMode: true,
    askAttendeeCount: true,
    maxAttendees: 15,
  },

  audio: {
    // Path inside /public. Starts when the guest taps "Open Invitation". Set to '' to disable.
    src: '/audio/nasheed.mp3',
    volume: 0.5,
  },

  theme: {
    emerald: '#123D32',
    forest: '#0B2923',
    ivory: '#F8F4EA',
    gold: '#C6A96B', // champagne gold, used on dark green
    goldDeep: '#8C6B30', // antique gold, used on ivory so it stays readable
    white: '#FFFFFF',
    decline: '#9A3B3B',
  },
} as const;

export type WeddingConfig = typeof wedding;

export const isPlaceholder = (value: string) => /^\s*\[.*\]\s*$/.test(value);
