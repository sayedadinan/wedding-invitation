const MAX_NAME_LENGTH = 60;

/**
 * Reads the optional ?name= display label from the URL.
 * Returns null when missing or invalid. This is a greeting label only — it does not identify anyone.
 */
export function getGuestName(search: string = window.location.search): string | null {
  let raw: string | null;
  try {
    // URLSearchParams already decodes %20, + and other encodings.
    raw = new URLSearchParams(search).get('name');
  } catch {
    return null;
  }
  if (!raw) return null;

  // Reject anything that looks like markup outright rather than trying to clean it.
  if (/[<>]/.test(raw)) return null;

  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;

  // Slice by code points so emoji / non-Latin letters aren't cut in half.
  return Array.from(cleaned).slice(0, MAX_NAME_LENGTH).join('').trim();
}
