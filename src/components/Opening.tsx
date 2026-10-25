import { motion } from 'framer-motion';
import { MailOpen } from 'lucide-react';
import { ease } from '../lib/motion';
import { Petals } from './Petals';

const TRANSLITERATION = 'Bismillahir Rahmanir Raheem';
const WRITE_DURATION = 2;
const LETTER_STAGGER = 0.035;
const LETTERS_START = WRITE_DURATION + 0.1;
const LETTERS_END = LETTERS_START + TRANSLITERATION.length * LETTER_STAGGER;

export function Opening({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      className="pattern fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-forest px-5 text-center"
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.8, ease }}
      aria-label="Invitation cover"
    >
      <Petals />
      <div
        className="soft-glow pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Revealed right-to-left so it reads as if being written; letters stay joined. */}
        <motion.p
          lang="ar"
          dir="rtl"
          className="px-2 py-3 font-arabic text-[2.6rem] font-medium leading-[1.6] text-gold sm:text-6xl"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          transition={{ duration: WRITE_DURATION, ease: 'easeInOut', delay: 0.2 }}
        >
          بسم الله الرحمن الرحيم
        </motion.p>

        <motion.p
          className="mt-2 font-serif text-2xl italic text-ivory sm:text-3xl"
          aria-label={TRANSLITERATION}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: LETTER_STAGGER, delayChildren: LETTERS_START } } }}
        >
          {Array.from(TRANSLITERATION).map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="inline-block whitespace-pre"
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.p>

        <motion.p
          className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-ivory/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: LETTERS_END }}
        >
          In the name of Allah, the Most Gracious, the Most Merciful
        </motion.p>

        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: LETTERS_END + 0.3, ease }}
          whileTap={{ scale: 0.97 }}
          className="mt-12 inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/70 bg-gold/10 px-8 py-3.5 text-sm uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-gold hover:text-forest"
        >
          <MailOpen size={18} aria-hidden="true" />
          Open Invitation
        </motion.button>
      </div>
    </motion.section>
  );
}
