import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, CircleHelp, Info, Loader2, Pencil, X } from 'lucide-react';
import { wedding } from '../config/wedding';
import { emptyMeals, isValidAttendance, mealGap, type MealCounts } from '../lib/meals';
import { ease } from '../lib/motion';
import { isDemo, RsvpError, submitRsvp, type RsvpResult, type RsvpStatus } from '../lib/rsvp';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';
import { Stepper } from './Stepper';

const MAX_NAME = 60;

const STATUS_OPTIONS: { value: RsvpStatus; label: string; icon: typeof Check }[] = [
  { value: 'attending', label: 'Attending', icon: Check },
  { value: 'declined', label: 'Unable to attend', icon: X },
  { value: 'maybe', label: 'Not sure yet', icon: CircleHelp },
];

const STATUS_LABEL: Record<RsvpStatus, string> = {
  attending: 'Attending',
  declined: 'Unable to attend',
  maybe: 'Not sure yet',
};

const panel = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.35, ease },
};

const primaryBtn =
  'flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-wine px-6 font-semibold text-paper transition-colors hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-45';
const ghostBtn =
  'flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-wine/40 px-6 text-sm font-semibold text-wine transition-colors hover:bg-wine/5';

const people = (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`;

export function Rsvp({ guestName }: { guestName: string | null }) {
  const { maxAttendees, meals: mealOptions, mealNote } = wedding.rsvp;
  const max = Math.max(1, Math.floor(maxAttendees));
  const demo = isDemo();

  const [view, setView] = useState<'form' | 'review' | 'done'>('form');
  const [name, setName] = useState(guestName ?? '');
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [count, setCount] = useState(1);
  const [meals, setMeals] = useState<MealCounts>(() => emptyMeals(mealOptions.map((m) => m.id)));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RsvpResult | null>(null);
  const inFlight = useRef(false);

  const attending = status === 'attending';
  const gap = mealGap(count, meals);
  const canReview = status !== null && (!attending || isValidAttendance(count, meals, max));
  const cleanName = name.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);

  async function send() {
    if (inFlight.current || !status) return; // guard against double taps
    inFlight.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitRsvp({
        status,
        count: attending ? count : 0,
        meals: attending ? meals : {},
        guestName: cleanName || null,
      });
      setResult(res);
      setView('done');
    } catch (err) {
      setError(err instanceof RsvpError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const summary = (
    <dl className="divide-y divide-line text-left">
      <SummaryRow term="Name" detail={cleanName || 'Not given'} />
      <SummaryRow term="Attendance" detail={status ? STATUS_LABEL[status] : '—'} />
      {attending && (
        <>
          <SummaryRow term="Number attending" detail={people(count)} />
          <SummaryRow
            term="Meals"
            detail={
              <ul className="space-y-0.5 text-right">
                {mealOptions
                  .filter((m) => meals[m.id] > 0)
                  .map((m) => (
                    <li key={m.id}>
                      {meals[m.id]} × {m.label}
                    </li>
                  ))}
              </ul>
            }
          />
        </>
      )}
    </dl>
  );

  return (
    <section id="rsvp" className="scroll-mt-4 px-6 py-16 sm:px-12" aria-labelledby="rsvp-heading">
      <div className="mx-auto max-w-2xl">
        <SectionLabel index="04" label="RSVP" />
        <Reveal>
          <h2 id="rsvp-heading" className="mt-8 font-display text-4xl font-light leading-tight text-ink">
            Coming to celebrate with us?
          </h2>
        </Reveal>

        {demo && (
          <p className="mt-5 flex gap-2 rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-ink">
            <Info size={18} className="mt-0.5 shrink-0 text-gold-text" aria-hidden="true" />
            <span>
              <strong>Demo preview.</strong> This form isn’t connected to the family’s sheet yet, so responses are not
              sent.
            </span>
          </p>
        )}

        <div className="paper-card mt-8 rounded-3xl p-5 sm:p-7" aria-live="polite">
          <AnimatePresence mode="wait">
            {view === 'form' && (
              <motion.form
                key="form"
                {...panel}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canReview) setView('review');
                }}
                noValidate
              >
                <label htmlFor="rsvp-name" className="text-sm font-semibold text-ink">
                  Your name <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  autoComplete="name"
                  maxLength={MAX_NAME}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink placeholder:text-muted/60 focus:border-wine"
                  placeholder="So the family knows who replied"
                />

                <fieldset className="mt-7">
                  <legend className="text-sm font-semibold text-ink">Will you attend?</legend>
                  <div className="mt-3 grid gap-2.5">
                    {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => {
                      const selected = status === value;
                      return (
                        <label
                          key={value}
                          className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wine ${
                            selected ? 'border-wine bg-wine text-paper' : 'border-line bg-paper text-ink hover:border-wine/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="attendance"
                            value={value}
                            checked={selected}
                            onChange={() => setStatus(value)}
                            className="sr-only"
                          />
                          <span
                            className={`flex size-8 items-center justify-center rounded-full ${
                              selected ? 'bg-paper/15' : 'bg-wine/5 text-wine'
                            }`}
                            aria-hidden="true"
                          >
                            <Icon size={17} />
                          </span>
                          <span className="font-semibold">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {attending && (
                    <motion.div
                      key="attending-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 border-t border-line pt-7">
                        <p className="text-sm font-semibold text-ink">How many people are coming, including you?</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <Stepper label="People attending" value={count} min={1} max={max} onChange={setCount} />
                          <span className="text-xs text-muted">Up to {max}</span>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-line pt-7">
                        <p className="text-sm font-semibold text-ink">What would your group prefer?</p>
                        <p lang="ml" className="mt-1.5 font-ml text-[0.95rem] leading-relaxed text-muted">
                          {mealNote}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {mealOptions.map((m) => (
                            <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
                              <span className="font-medium text-ink">{m.label}</span>
                              <Stepper
                                label={m.label}
                                value={meals[m.id]}
                                min={0}
                                max={max}
                                onChange={(v) => setMeals((prev) => ({ ...prev, [m.id]: v }))}
                              />
                            </li>
                          ))}
                        </ul>
                        <p
                          className={`mt-3 flex items-center gap-2 text-sm font-medium ${gap === 0 ? 'text-[#2f6b4f]' : 'text-wine'}`}
                          aria-live="polite"
                        >
                          {gap === 0 ? (
                            <>
                              <Check size={16} aria-hidden="true" /> Meals for all {people(count)} chosen
                            </>
                          ) : gap > 0 ? (
                            <>
                              <AlertCircle size={16} aria-hidden="true" /> Choose meals for {people(gap)} more
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} aria-hidden="true" /> {-gap} meal{gap === -1 ? '' : 's'} too many for{' '}
                              {people(count)}. Please reduce a choice.
                            </>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={!canReview} className={`${primaryBtn} mt-8`}>
                  Review my response
                </button>
                {status === null && <p className="mt-2 text-center text-xs text-muted">Choose an option above to continue.</p>}
              </motion.form>
            )}

            {view === 'review' && (
              <motion.div key="review" {...panel}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-text">Please check</p>
                <div className="mt-3">{summary}</div>

                {error && (
                  <p className="mt-5 flex gap-2 rounded-xl bg-wine/10 px-4 py-3 text-sm text-wine" role="alert">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {error}
                  </p>
                )}

                <button type="button" onClick={send} disabled={submitting} className={`${primaryBtn} mt-7`}>
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
                    </>
                  ) : error ? (
                    'Try again'
                  ) : demo ? (
                    'Submit (demo)'
                  ) : (
                    'Send response'
                  )}
                </button>
                <button type="button" onClick={() => setView('form')} disabled={submitting} className={`${ghostBtn} mt-3`}>
                  <Pencil size={15} aria-hidden="true" /> Edit
                </button>
              </motion.div>
            )}

            {view === 'done' && result && status && (
              <motion.div key="done" {...panel} className="text-center">
                {result.saved ? (
                  <>
                    <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-wine text-paper">
                      <Check size={26} aria-hidden="true" />
                    </span>
                    <p className="mt-5 font-display text-3xl text-ink">Your response has been sent.</p>
                    <p className="mt-2 text-muted">
                      {status === 'attending' && wedding.invitation.closing}
                      {status === 'declined' && 'Thank you for letting us know. You will be in our thoughts and duas.'}
                      {status === 'maybe' && 'Thank you. Please update your response when you know.'}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold text-gold-text">
                      <Info size={24} aria-hidden="true" />
                    </span>
                    <p className="mt-5 font-display text-3xl text-ink">Demo preview</p>
                    <p className="mt-2 text-muted">
                      This response was <strong>not sent</strong>. The RSVP isn’t connected to the family’s sheet yet, so
                      nothing was recorded.
                    </p>
                  </>
                )}
                <div className="mt-6 rounded-2xl bg-paper px-4 py-2">{summary}</div>
                <button type="button" onClick={() => setView('form')} className={`${ghostBtn} mt-6`}>
                  <Pencil size={15} aria-hidden="true" /> Change my response
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Your name, attendance and meal choices are recorded only to help the family plan the wedding. They are not
          shown to other guests.
        </p>
      </div>
    </section>
  );
}

function SummaryRow({ term, detail }: { term: string; detail: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="text-right font-semibold text-ink">{detail}</dd>
    </div>
  );
}
