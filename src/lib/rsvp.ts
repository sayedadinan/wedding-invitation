import { wedding } from '../config/wedding';

export type RsvpStatus = 'attending' | 'declined';

export interface RsvpPayload {
  status: RsvpStatus;
  count: number;
  guestName: string | null;
}

export class RsvpError extends Error {}

const SUBMISSION_KEY = 'wedding-rsvp-submission-id';
const TIMEOUT_MS = 20000;

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

let fallbackId: string | undefined;

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Resolves only when the backend confirms the row was written. */
export async function submitRsvp({ status, count, guestName }: RsvpPayload): Promise<void> {
  const endpoint = wedding.rsvp.endpoint.trim();
  if (!endpoint && import.meta.env.DEV) {
    // Local preview only (npm run dev). Production builds never reach this branch.
    console.warn('[RSVP] No endpoint set — simulating a save for local preview. Nothing was recorded.');
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  if (!endpoint) {
    throw new RsvpError('RSVP is not connected yet. Please try again a little later.');
  }

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
        guestName: guestName ?? 'Guest',
        status,
        count: status === 'declined' ? 0 : count,
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
}
