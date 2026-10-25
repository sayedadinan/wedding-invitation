import { motion } from 'framer-motion';

interface StarProps {
  size?: number;
  className?: string;
}

export function Star({ size = 18, className = '' }: StarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" />
      <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-linear-to-r from-transparent to-gold/70 sm:w-24" />
      <Star />
      <span className="h-px w-14 bg-linear-to-l from-transparent to-gold/70 sm:w-24" />
    </div>
  );
}

/** Eight-point Islamic star that draws itself in fine gold, flanked by fading lines. */
export function DrawnStar({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  };
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <motion.span
        className="h-px w-16 origin-right bg-linear-to-r from-transparent to-current sm:w-24"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: delay + 0.6 }}
      />
      <svg width="56" height="56" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3">
        <motion.path d="M10 10H30V30H10Z" {...draw} transition={{ duration: 1.4, delay, ease: 'easeInOut' }} />
        <motion.path
          d="M20 5.86L34.14 20L20 34.14L5.86 20Z"
          {...draw}
          transition={{ duration: 1.4, delay: delay + 0.3, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="20"
          cy="20"
          r="2.4"
          fill="currentColor"
          stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 1.3 }}
        />
      </svg>
      <motion.span
        className="h-px w-16 origin-left bg-linear-to-l from-transparent to-current sm:w-24"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: delay + 0.6 }}
      />
    </div>
  );
}
