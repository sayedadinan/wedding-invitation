import { motion } from 'framer-motion';
import { ease } from '../lib/motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Quiet fade-up once a block scrolls into view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
