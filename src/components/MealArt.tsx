import type { MealOption } from '../config/wedding';

/** Small hand-drawn style food illustrations (original inline SVG, no external assets). */
export function MealArt({ art, className = '' }: { art: MealOption['art']; className?: string }) {
  return art === 'biriyani' ? <Biriyani className={className} /> : <Neychoru className={className} />;
}

function Steam() {
  return (
    <g fill="none" stroke="var(--c-gold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
      <path className="steam" d="M24 16c-2-3 2-5 0-8" />
      <path className="steam steam-2" d="M32 14c-2-3 2-5 0-8" />
      <path className="steam steam-3" d="M40 16c-2-3 2-5 0-8" />
    </g>
  );
}

function Biriyani({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <Steam />
      {/* rice dome */}
      <path d="M13 31c2-9 10-13 19-13s17 4 19 13z" fill="#FFF4DC" stroke="#E8D3A8" strokeWidth="1" />
      {/* saffron grains, meat, mint */}
      <g fill="#E39B2E">
        <rect x="20" y="25" width="5" height="1.8" rx="0.9" transform="rotate(-20 22 26)" />
        <rect x="33" y="21" width="5" height="1.8" rx="0.9" transform="rotate(15 35 22)" />
        <rect x="40" y="27" width="5" height="1.8" rx="0.9" transform="rotate(-10 42 28)" />
        <rect x="27" y="28" width="4" height="1.6" rx="0.8" transform="rotate(25 29 29)" />
      </g>
      <circle cx="30" cy="24" r="2.6" fill="#7A3B22" />
      <circle cx="38" cy="28" r="2.2" fill="#7A3B22" />
      <ellipse cx="25" cy="21.5" rx="2.6" ry="1.3" fill="#5E8C4A" transform="rotate(-30 25 21.5)" />
      {/* handi pot */}
      <rect x="9" y="30" width="46" height="5" rx="2.5" fill="#6B3420" />
      <path d="M12 35h40c0 13-8 21-20 21s-20-8-20-21z" fill="#8E4A2A" />
      <path d="M15 41h34" stroke="var(--c-gold)" strokeWidth="1.5" />
      <path d="M12 38c-5 1-5 6 0 7M52 38c5 1 5 6 0 7" fill="none" stroke="#6B3420" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Neychoru({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <Steam />
      {/* plate */}
      <ellipse cx="30" cy="46" rx="26" ry="10" fill="#FFFFFF" stroke="#E3D3BC" strokeWidth="1.2" />
      <ellipse cx="30" cy="45" rx="19" ry="6.5" fill="none" stroke="#EFE4D2" strokeWidth="1" />
      {/* ghee rice mound */}
      <path d="M11 45c1-10 8-16 16-16s14 6 15 16z" fill="#FBEBC4" stroke="#E8D3A8" strokeWidth="1" />
      {/* cashews and raisins */}
      <path d="M18 38a3 3 0 0 0 5 1" fill="none" stroke="#D69E5A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M28 33a3 3 0 0 0 5 1" fill="none" stroke="#D69E5A" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="25" cy="40" r="1.4" fill="#5C1626" />
      <circle cx="33" cy="39" r="1.4" fill="#5C1626" />
      <circle cx="22" cy="34" r="1.2" fill="#5C1626" />
      {/* stew bowl */}
      <path d="M40 40h20c0 7-4 11-10 11s-10-4-10-11z" fill="#FFFFFF" stroke="#E3D3BC" strokeWidth="1.2" />
      <ellipse cx="50" cy="40" rx="10" ry="3" fill="#F4E6C8" />
      <circle cx="46" cy="40" r="1.2" fill="#E8833A" />
      <circle cx="53" cy="39.5" r="1.2" fill="#E8833A" />
      <circle cx="50" cy="41" r="1" fill="#6E9B4A" />
      <ellipse cx="55" cy="40.5" rx="1.8" ry="0.8" fill="#4F7A3A" transform="rotate(-20 55 40.5)" />
    </svg>
  );
}
