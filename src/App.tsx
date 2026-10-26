import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
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
  const pastCover = usePastCover();

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" />
      <Cover guestName={guestName} />
      <main>
        <InvitationMessage />
        <Timeline />
        <Venue />
        <Rsvp guestName={guestName} />
      </main>
      <Closing />
      {audio.available && (pastCover || audio.playing) && <MusicToggle playing={audio.playing} onToggle={audio.toggle} />}
    </MotionConfig>
  );
}

/** True once the guest has scrolled most of the way past the cover, so the floating button never hides its CTA. */
function usePastCover() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return past;
}
