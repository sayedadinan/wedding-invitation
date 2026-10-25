import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, CalendarDays, Check, Clock, Heart, Loader2, MapPin, Minus, Navigation, Plus } from 'lucide-react';
import { wedding } from '../config/wedding';
import { formatEventDate } from '../lib/date';
import { mapsLink } from '../lib/links';
import { RsvpError, submitRsvp, type RsvpStatus } from '../lib/rsvp';
import { ease } from '../lib/motion';
import { Confetti } from './Confetti';
import { Countdown } from './Countdown';
import { Divider } from './Ornament';
import { PassCard } from './PassCard';

type Step =
  | { kind: 'choose' }
  | { kind: 'count' }
  | { kind: 'submitting'; status: RsvpStatus }
  | { kind: 'done'; status: RsvpStatus; count: number }
  | { kind: 'error'; status: RsvpStatus; count: number; message: string };

const panel = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.45, ease },
};

const primaryBtn =
  'inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';
const detailCard = 'flex flex-col items-center rounded-2xl border border-gold/30 bg-emerald/70 px-4 py-5';
const linkBtn ='mt-4 min-h-11 text-sm text-ivory/60 underline-offset-4 hover:text-ivory hover:underline';

export function Rsvp({ guestName }: { guestName: string | null }) {
  const { askAttendeeCount, maxAttendees } = wedding.rsvp;
  const max = Math.max(1, Math.floor(maxAttendees));
  const event = formatEventDate(wedding.event.dateTime, wedding.event.timeZone);
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>({ kind: 'choose' });
  const [count, setCount] = useState(1);
  const [burst, setBurst] = useState(0);
  const inFlight = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const confirmedYes = step.kind === 'done' && step.status === 'attending';

  useEffect(() => {
    if (step.kind === 'done') {
      sectionRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [step.kind, reduceMotion]);

  async function send(status: RsvpStatus, attendees: number) {
    if (inFlight.current) return; // guard against double taps
    const n = status === 'declined' ? 0 : attendees;
    if (status === 'attending' && (!Number.isInteger(n) || n < 1 || n > max)) {
      setStep({ kind: 'error', status, count: 1, message: `Please choose between 1 and ${max} guests.` });
      return;
    }

    inFlight.current = true;
    setStep({ kind: 'submitting', status });
    try {
      await submitRsvp({ status, count: n, guestName });
      setStep({ kind: 'done', status, count: n });
      if (status === 'attending') setBurst((b) => b + 1);
    } catch (err) {
      const message = err instanceof RsvpError ? err.message : 'Something went wrong. Please try again.';
      setStep({ kind: 'error', status, count: n, message });
    } finally {
      inFlight.current = false;
    }
  }

  function chooseYes() {
    setBurst((b) => b + 1);
    if (askAttendeeCount) setStep({ kind: 'count' });
    else void send('attending', 1);
  }

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="pattern min-h-dvh scroll-mt-0 bg-forest px-5 py-14 text-center"
      aria-labelledby="rsvp-heading"
    >
      <Confetti burst={burst} />

      <div className="mx-auto max-w-md">
        {!confirmedYes && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">Save the date</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={detailCard}>
                <CalendarDays className="text-gold" size={22} strokeWidth={1.4} aria-hidden="true" />
                <p className="mt-2 font-serif text-2xl text-ivory">{event ? event.weekday : 'Date'}</p>
                <p className="text-sm text-ivory/70">{event ? event.date : 'To be announced'}</p>
              </div>
              <div className={detailCard}>
                <Clock className="text-gold" size={22} strokeWidth={1.4} aria-hidden="true" />
                <p className="mt-2 font-serif text-2xl text-ivory">{wedding.event.title}</p>
                <p className="text-sm text-ivory/70">{event ? event.time : 'To be announced'}</p>
              </div>
              <div className={`${detailCard} col-span-2`}>
                <MapPin className="text-gold" size={22} strokeWidth={1.4} aria-hidden="true" />
                <p className="mt-2 font-serif text-2xl text-ivory">{wedding.venue.name}</p>
                <p className="text-sm text-ivory/70">{wedding.venue.address}</p>
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/70 px-6 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-forest"
                >
                  <Navigation size={15} aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>

            {event && (
              <div className="mt-8">
                <Countdown target={event.timestamp} />
              </div>
            )}

            <Divider className="my-9" />
          </motion.div>
        )}

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {step.kind === 'choose' && (
              <motion.div key="choose" {...panel}>
                <h2 id="rsvp-heading" className="mb-6 font-serif text-3xl text-ivory sm:text-4xl">
                  Will you be joining us?
                </h2>
                <div className="space-y-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={chooseYes}
                    className={`${primaryBtn} border border-gold/50 bg-emerald text-ivory shadow-lg shadow-black/25 hover:bg-[#185243]`}
                  >
                    <Heart size={18} aria-hidden="true" />
                    Yes, Insha'Allah
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => send('declined', 0)}
                    className={`${primaryBtn} border border-decline/70 bg-decline/15 text-ivory hover:bg-decline/35`}
                  >
                    Regretfully, unable to attend
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step.kind === 'count' && (
              <motion.div key="count" {...panel} role="group" aria-labelledby="count-label">
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="font-serif text-4xl text-gold"
                >
                  Wonderful!
                </motion.p>
                <p id="count-label" className="mt-3 font-serif text-2xl text-ivory">
                  How many guests will be attending, including you?
                </p>
                <div className="mt-6 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    disabled={count <= 1}
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    className="flex size-12 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold/15 disabled:opacity-30"
                  >
                    <Minus size={20} aria-hidden="true" />
                  </button>
                  <output className="w-16 font-serif text-6xl tabular-nums text-ivory" aria-live="polite">
                    {count}
                  </output>
                  <button
                    type="button"
                    aria-label="More guests"
                    disabled={count >= max}
                    onClick={() => setCount((c) => Math.min(max, c + 1))}
                    className="flex size-12 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold/15 disabled:opacity-30"
                  >
                    <Plus size={20} aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-ivory/50">Up to {max}</p>
                <button
                  type="button"
                  onClick={() => send('attending', count)}
                  className={`${primaryBtn} mt-7 border border-gold/50 bg-emerald text-ivory hover:bg-[#185243]`}
                >
                  <Check size={18} aria-hidden="true" />
                  Confirm
                </button>
                <button type="button" onClick={() => setStep({ kind: 'choose' })} className={linkBtn}>
                  Back
                </button>
              </motion.div>
            )}

            {step.kind === 'submitting' && (
              <motion.div key="submitting" {...panel} className="flex flex-col items-center gap-4 py-10" role="status">
                <Loader2 className="animate-spin text-gold" size={32} aria-hidden="true" />
                <p className="text-ivory/80">Saving your response…</p>
              </motion.div>
            )}

            {step.kind === 'error' && (
              <motion.div key="error" {...panel} role="alert">
                <AlertCircle className="mx-auto text-[#e08a8a]" size={30} aria-hidden="true" />
                <p className="mt-4 text-ivory">{step.message}</p>
                <button
                  type="button"
                  onClick={() => send(step.status, step.count)}
                  className={`${primaryBtn} mt-7 border border-gold/60 bg-gold/10 text-ivory hover:bg-gold/25`}
                >
                  Try again
                </button>
                <button type="button" onClick={() => setStep({ kind: 'choose' })} className={linkBtn}>
                  Back
                </button>
              </motion.div>
            )}

            {step.kind === 'done' && step.status === 'attending' && (
              <motion.div key="done-yes" {...panel}>
                <p className="font-serif text-4xl text-gold">Alhamdulillah!</p>
                <p className="mt-2 font-serif text-3xl text-ivory">We can't wait to see you</p>
                <p className="mt-2 text-sm text-ivory/70">
                  Thank you for confirming. We look forward to celebrating this special occasion with you.
                </p>
                <PassCard guestName={guestName} count={step.count} />
                <button type="button" onClick={() => setStep({ kind: 'choose' })} className={`${linkBtn} mt-6`}>
                  Change my response
                </button>
              </motion.div>
            )}

            {step.kind === 'done' && step.status === 'declined' && (
              <motion.div key="done-no" {...panel}>
                <Heart className="mx-auto text-gold" size={28} aria-hidden="true" />
                <p className="mt-4 font-serif text-3xl text-ivory">Thank you for letting us know.</p>
                <p className="mt-2 text-ivory/75">You will be in our thoughts and duas.</p>
                <button type="button" onClick={() => setStep({ kind: 'choose' })} className={`${linkBtn} mt-6`}>
                  Change my response
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-ivory/40">
          Your response{guestName ? ' and the name in your invitation link' : ''} is recorded only to help the
          family plan the wedding. It is not shared with other guests.
        </p>
        <p className="mt-8 text-[0.68rem] uppercase tracking-[0.25em] text-ivory/45">{wedding.familySignOff}</p>
        <p className="mt-1 font-serif text-lg text-ivory/70">
          {wedding.couple.bride} &amp; {wedding.couple.groom}
        </p>
      </div>
    </section>
  );
}
