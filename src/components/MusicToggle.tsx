import { Music, Pause } from 'lucide-react';

/** Pause / resume the nasheed that started when the guest opened the invitation. */
export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause nasheed' : 'Play nasheed'}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-wine/25 bg-paper/90 px-4 text-xs font-semibold text-wine shadow-lg shadow-wine/10 backdrop-blur transition-colors hover:bg-paper"
    >
      {playing ? <Pause size={15} aria-hidden="true" /> : <Music size={15} aria-hidden="true" />}
      {playing ? 'Pause' : 'Nasheed'}
    </button>
  );
}
