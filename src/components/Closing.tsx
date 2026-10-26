import { ArrowUp } from 'lucide-react';
import { wedding } from '../config/wedding';
import { Reveal } from './Reveal';

export function Closing() {
  const { invitation, couple } = wedding;
  return (
    <footer className="border-t border-line px-6 pb-24 pt-16 text-center sm:px-12">
      <Reveal className="mx-auto max-w-md">
        <p className="font-display text-xl italic leading-relaxed text-muted">{invitation.closing}</p>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-gold-text">{invitation.familySignOff}</p>
        <p className="mt-2 font-display text-3xl font-light text-wine">
          {couple.bride} <span className="italic text-gold">&amp;</span> {couple.groom}
        </p>
        <a
          href="#top"
          className="mt-10 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted underline-offset-4 hover:text-wine hover:underline"
        >
          <ArrowUp size={15} aria-hidden="true" /> Back to top
        </a>
      </Reveal>
    </footer>
  );
}
