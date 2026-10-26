import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { wedding } from './config/wedding';
import { getGuestName } from './lib/guestName';
import { useAudio } from './hooks/useAudio';
import { Cover } from './components/Cover';
import { InvitationMessage } from './components/InvitationMessage';
import { Timeline } from './components/Timeline';
import { Venue } from './components/Venue';
import { Rsvp } from './components/Rsvp';
import { Closing } from './components/Closing';
import { MusicToggle } from './components/MusicToggle';

export default function App() {
  const guestName = useMemo(() => getGuestName(), []);
  const audio = useAudio(wedding.audio.src, wedding.audio.volume);
  const [opened, setOpened] = useState(false);

  // The cover is its own screen: no scrolling until the guest taps through.
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
  }, [opened]);

  const handleOpen = () => {
    void audio.play(); // started by the tap, so browsers allow it
    window.scrollTo(0, 0);
    setOpened(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!opened && <Cover key="cover" guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {opened && (
        <>
          <div id="top" />
          <main>
            <InvitationMessage />
            <Timeline />
            <Venue />
            <Rsvp guestName={guestName} />
          </main>
          <Closing />
          {audio.available && <MusicToggle playing={audio.playing} onToggle={audio.toggle} />}
        </>
      )}
    </MotionConfig>
  );
}
