/** Editorial chapter marker: "02 ─── Celebration plan". */
export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="font-display text-sm italic text-gold-text">{index}</span>
      <span className="h-px flex-1 bg-line" />
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">{label}</span>
    </div>
  );
}
