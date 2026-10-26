import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const btn =
  'flex size-12 shrink-0 items-center justify-center rounded-full border border-wine/40 text-wine transition-colors hover:bg-wine/5 disabled:cursor-not-allowed disabled:opacity-30';

/** Integer selector with large tap targets. */
export function Stepper({ label, value, min, max, onChange }: StepperProps) {
  return (
    <div className="flex items-center gap-4" role="group" aria-label={label}>
      <button type="button" className={btn} aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <Minus size={18} aria-hidden="true" />
      </button>
      <output className="w-10 text-center font-display text-3xl tabular-nums text-ink" aria-live="polite" aria-label={`${label}: ${value}`}>
        {value}
      </output>
      <button type="button" className={btn} aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
