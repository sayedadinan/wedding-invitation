import { useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { wedding } from './config/wedding';
import { getGuestName } from './lib/guestName';
import { useAudio } from './hooks/useAudio';
import { Opening } from './components/Opening';
import { Hero } from './components/Hero';
import { Rsvp } from './components/Rsvp';
import { AudioToggle } from './components/AudioToggle';

export default function App() {
  const guestName = useMemo(() => getGuestName(), []);
  const [opened, setOpened] = useState(false);
  const audio = useAudio(wedding.audio.src, wedding.audio.volume);

  const handleOpen = () => {
    window.scrollTo(0, 0);
    setOpened(true);
    void audio.play(); // started by the tap, so browsers allow it
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!opened && <Opening key="opening" onOpen={handleOpen} />}</AnimatePresence>

      {opened && (
        <main>
          <Hero guestName={guestName} />
          <Rsvp guestName={guestName} />
        </main>
      )}

      {audio.available && audio.started && <AudioToggle playing={audio.playing} onToggle={audio.toggle} />}
    </MotionConfig>
  );
}
