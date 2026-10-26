import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['var(--c-wine)', 'var(--c-gold)', '#E9C98F', '#FFFFFF', '#D98C8C', '#F3E9DA'];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Party-popper burst from both bottom corners. Fires again whenever `burst` changes. */
export function Poppers({ burst, pieces = 80 }: { burst: number; pieces?: number }) {
  const reduce = useReducedMotion();

  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => {
        const fromLeft = i % 2 === 0;
        const shape = i % 3; // 0 ribbon, 1 dot, 2 petal
        return {
          fromLeft,
          color: COLORS[i % COLORS.length],
          x: (fromLeft ? 1 : -1) * rand(60, 360),
          peak: rand(320, 700),
          fall: rand(200, 560),
          rotate: rand(-720, 720),
          duration: rand(2, 3.2),
          delay: rand(0, 0.2),
          width: shape === 0 ? 6 : shape === 1 ? 7 : 10,
          height: shape === 0 ? 14 : shape === 1 ? 7 : 10,
          radius: shape === 0 ? '1px' : shape === 1 ? '50%' : '80% 0 80% 0',
        };
      }),
    [burst, pieces],
  );

  if (!burst || reduce) return null;

  return (
    <div key={burst} className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {bits.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0"
          style={{
            [p.fromLeft ? 'left' : 'right']: '3%',
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

/** Gold four-point sparks bursting out from the centre of their parent. */
export function Sparkles({ count = 12 }: { count?: number }) {
  const reduce = useReducedMotion();
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
        const dist = rand(46, 84);
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: rand(8, 16),
          delay: rand(0.05, 0.35),
        };
      }),
    [count],
  );
  if (reduce) return null;

  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {sparks.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-gold"
          initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
          animate={{ x: s.x, y: s.y, scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: 90 }}
          transition={{ duration: 1.3, delay: s.delay, ease: 'easeOut' }}
        >
          <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="currentColor" />
        </motion.svg>
      ))}
    </span>
  );
}
