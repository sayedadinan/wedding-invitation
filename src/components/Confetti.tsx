import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['var(--c-gold)', 'var(--c-ivory)', '#ffffff', '#E3CF9E', '#3E8E73', '#D9A5A0'];
const PIECES = 70;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Party-popper burst from both bottom corners. Re-fires whenever `burst` changes. */
export function Confetti({ burst }: { burst: number }) {
  const reduce = useReducedMotion();

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => {
        const fromLeft = i % 2 === 0;
        const peak = rand(320, 680);
        const shape = i % 3; // 0 strip, 1 dot, 2 petal
        return {
          fromLeft,
          color: COLORS[i % COLORS.length],
          x: (fromLeft ? 1 : -1) * rand(60, 340),
          peak,
          fall: rand(180, 520),
          rotate: rand(-720, 720),
          duration: rand(1.9, 3),
          delay: rand(0, 0.25),
          width: shape === 0 ? 6 : shape === 1 ? 7 : 10,
          height: shape === 0 ? 13 : shape === 1 ? 7 : 10,
          radius: shape === 0 ? '1px' : shape === 1 ? '50%' : '80% 0 80% 0',
        };
      }),
    [burst],
  );

  if (!burst || reduce) return null;

  return (
    <div key={burst} className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0"
          style={{
            [p.fromLeft ? 'left' : 'right']: '4%',
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.radius,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: [0, p.x * 0.7, p.x],
            y: [0, -p.peak, -p.peak + p.fall],
            rotate: [0, p.rotate / 2, p.rotate],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, times: [0, 0.4, 1], ease: ['easeOut', 'easeIn'] }}
        />
      ))}
    </div>
  );
}
