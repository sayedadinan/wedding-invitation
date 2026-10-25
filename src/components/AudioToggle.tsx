import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      aria-label={playing ? 'Mute nasheed' : 'Play nasheed'}
      aria-pressed={playing}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex size-12 items-center justify-center rounded-full border border-gold/60 bg-forest/85 text-gold shadow-lg backdrop-blur transition-colors hover:bg-forest"
    >
      {playing ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
    </motion.button>
  );
}
