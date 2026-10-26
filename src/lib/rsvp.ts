import { wedding } from '../config/wedding';

export type RsvpStatus = 'attending' | 'declined' | 'maybe';

export interface RsvpPayload {
  status: RsvpStatus;
  count: number;
  /** Meal id → quantity. Only meaningful when attending; must add up to `count`. */
  meals: Record<string, number>;
  guestName: string | null;
}

/** `saved: false` means demo mode — nothing reached the host. */
export type RsvpResult = { saved: true } | { saved: false; demo: true };

export class RsvpError extends Error {}

const SUBMISSION_KEY = 'wedding-rsvp-submission-id';
const TIMEOUT_MS = 20000;

let fallbackId: string | undefined;

/** One id per browser so a changed answer updates the same row instead of adding a new one. */
export function getSubmissionId(): string {
  try {
    const existing = localStorage.getItem(SUBMISSION_KEY);
    if (existing) return existing;
    const id = createId();
    localStorage.setItem(SUBMISSION_KEY, id);
    return id;
  } catch {
    // Storage blocked (private mode): fall back to an id that lives for this page load.
    return (fallbackId ??= createId());
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export const isDemo = () => !wedding.rsvp.endpoint.trim() && (import.meta.env.DEV || wedding.rsvp.demoMode);

/** Resolves with `saved: true` only when the backend confirms the row was written. */
export async function submitRsvp({ status, count, meals, guestName }: RsvpPayload): Promise<RsvpResult> {
  const endpoint = wedding.rsvp.endpoint.trim();
  if (!endpoint) {
    if (isDemo()) {
      await new Promise((r) => setTimeout(r, 700));
      return { saved: false, demo: true };
    }
    throw new RsvpError('RSVP is not connected yet. Please try again a little later.');
  }

  const attending = status === 'attending';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    // text/plain keeps this a "simple" CORS request, which Apps Script supports (no preflight).
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        submissionId: getSubmissionId(),
        guestName: guestName || 'Guest',
        status,
        count: attending ? count : 0,
        meals: attending ? meals : {},
        website: '', // honeypot, must stay empty
      }),
      signal: controller.signal,
      redirect: 'follow',
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new RsvpError('The connection is slow and the request timed out. Please try again.');
    }
    throw new RsvpError('We could not reach the server. Please check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new RsvpError('The RSVP service is unavailable right now. Please try again shortly.');
  }

  const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!data || data.ok !== true) {
    throw new RsvpError('Your response could not be saved. Please try again.');
  }
  return { saved: true };
}
