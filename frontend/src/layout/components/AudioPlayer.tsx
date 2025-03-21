import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioElement } = usePlayerStore();

  useEffect(() => {
    if (audioElement && audioRef.current) {
      audioRef.current = audioElement;
    }
  }, [audioElement]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
