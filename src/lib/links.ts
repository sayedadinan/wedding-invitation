import { isPlaceholder, wedding, type WeddingEvent } from '../config/wedding';

export function mapsLink(event: WeddingEvent): string {
  if (event.mapsUrl.trim()) return event.mapsUrl.trim();
  const query = isPlaceholder(event.venueName) ? event.address : `${event.venueName}, ${event.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Returns a tel: link, or null while the phone number is still a placeholder. */
export function phoneLink(): string | null {
  const phone = wedding.contact.phone;
  if (!phone || isPlaceholder(phone)) return null;
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.length >= 6 ? `tel:${digits}` : null;
}
