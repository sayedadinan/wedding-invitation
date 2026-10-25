import { useCallback, useEffect, useRef, useState } from 'react';

/** Optional background audio. Only starts from a user gesture; failures just hide the control. */
export function useAudio(src: string, volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(Boolean(src));
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio();
    audio.src = src;
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = volume;
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    audio.addEventListener('error', onError);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [src, volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    try {
      await audio.play();
      setStarted(true);
      setPlaying(true);
    } catch {
      // Autoplay refused or file missing: the invitation carries on silently.
      setPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else {
      audio.pause();
      setPlaying(false);
    }
  }, [play]);

  return { available, started, playing, play, toggle };
}
