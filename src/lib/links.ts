import { isPlaceholder, wedding } from '../config/wedding';

export function mapsLink(): string {
  const { mapsUrl, name, address } = wedding.venue;
  if (mapsUrl.trim()) return mapsUrl.trim();
  const query = isPlaceholder(name) ? address : `${name}, ${address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Returns a tel: link, or null while the phone number is still a placeholder. */
export function phoneLink(): string | null {
  const phone = wedding.contact.phone;
  if (!phone || isPlaceholder(phone)) return null;
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.length >= 6 ? `tel:${digits}` : null;
}
