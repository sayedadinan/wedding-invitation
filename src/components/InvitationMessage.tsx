import { wedding } from '../config/wedding';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';

export function InvitationMessage() {
  const { invitation, couple } = wedding;

  return (
    <section id="invitation" className="scroll-mt-4 px-6 py-16 sm:px-12" aria-labelledby="invitation-heading">
      <div className="mx-auto max-w-2xl">
        <SectionLabel index="01" label="The invitation" />

        <Reveal className="mt-10">
          <p lang="ar" dir="rtl" className="text-center font-arabic text-3xl text-gold-text">
            {invitation.bismillah}
          </p>
          <p className="mt-2 text-center font-display text-base italic text-muted">
            {invitation.bismillahTransliteration}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <h2 id="invitation-heading" className="font-display text-[1.7rem] font-light leading-snug text-ink sm:text-3xl">
            {invitation.line}{' '}
            <span className="text-wine">
              {couple.bride} <span className="italic text-gold">&amp;</span> {couple.groom}
            </span>
            .
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{invitation.presence}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <figure className="border-l-2 border-wine/70 pl-5">
            <blockquote className="font-display text-xl italic text-ink">“{invitation.verse}”</blockquote>
            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">
              {invitation.verseReference}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 text-right">
          <p className="text-sm text-muted">{invitation.familySignOff}</p>
          <p className="mt-1 font-display text-2xl text-wine">
            {couple.bride} &amp; {couple.groom}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
