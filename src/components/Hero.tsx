import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { wedding } from '../config/wedding';
import { ease } from '../lib/motion';
import { DrawnStar } from './Ornament';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

export function Hero({ guestName }: { guestName: string | null }) {
  const { bride, groom } = wedding.couple;
  const words = wedding.verse.text.split(' ');

  return (
    <section className="pattern pattern-emerald relative flex min-h-dvh flex-col items-center justify-center bg-ivory px-5 pb-20 pt-12 text-center text-emerald">
      <motion.p {...fadeUp(0.2)} className="text-xs font-medium uppercase tracking-[0.35em] text-gold-deep">
        An exclusive invitation for
      </motion.p>
      <motion.p {...fadeUp(0.4)} className="mt-2 max-w-full break-words font-serif text-5xl italic sm:text-6xl">
        {guestName ?? 'You'}
      </motion.p>

      <DrawnStar className="my-6 text-gold-deep" delay={0.8} />

      <motion.p {...fadeUp(1)} className="max-w-xs text-sm leading-relaxed text-emerald/75">
        With the blessings of Allah, we joyfully invite you to celebrate the wedding of
      </motion.p>

      <motion.h1 {...fadeUp(1.2)} className="mt-5 font-serif font-medium leading-[1.05]">
        <span className="block text-[2.75rem] sm:text-6xl">{bride}</span>
        <span className="my-1 block text-3xl italic text-gold-deep" aria-label="and">
          &amp;
        </span>
        <span className="block text-[2.75rem] sm:text-6xl">{groom}</span>
      </motion.h1>

      {/* Ayah revealed word by word */}
      <motion.figure
        className="mt-9 max-w-sm"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.8 } } }}
      >
        <blockquote className="font-serif text-2xl italic leading-snug text-emerald">
          “
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{ hidden: { opacity: 0, y: 6, filter: 'blur(4px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
              transition={{ duration: 0.6 }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
          ”
        </blockquote>
        <motion.figcaption
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-gold-deep"
        >
          {wedding.verse.reference}
        </motion.figcaption>
      </motion.figure>

      <a
        href="#rsvp"
        aria-label="See date, venue and RSVP"
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-emerald/55"
      >
        <span>RSVP</span>
        <ChevronDown size={18} className="animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
