// Gently drifting petals, pure CSS so they cost almost nothing (disabled under reduced motion).
const PETALS = [
  { left: '6%', delay: 0, duration: 11, size: 10, tone: 'gold' },
  { left: '18%', delay: 3.5, duration: 13, size: 8, tone: 'ivory' },
  { left: '31%', delay: 7, duration: 12, size: 11, tone: 'gold' },
  { left: '47%', delay: 1.5, duration: 14, size: 7, tone: 'ivory' },
  { left: '60%', delay: 5, duration: 11, size: 10, tone: 'gold' },
  { left: '73%', delay: 9, duration: 13, size: 8, tone: 'ivory' },
  { left: '85%', delay: 2.5, duration: 12, size: 11, tone: 'gold' },
  { left: '94%', delay: 6.5, duration: 14, size: 7, tone: 'ivory' },
];

export function Petals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={`petal petal-${p.tone}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
