import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    volume,
    setProgress,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    isRepeated,
    audioElement,
  } = usePlayerStore();

  const { startPlayingMusic, stopPlayingMusic } = useChatStore();
  const { user } = useUser();
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(volume);

  // Emit activity updates when the play/pause state changes
  useEffect(() => {
    if (user) {
      if (isPlaying && currentSong) {
        startPlayingMusic(
          user.id,
          currentSong.song.title,
          currentSong.song.artist
        );
      } else {
        stopPlayingMusic(user.id);
      }
    }
  }, [isPlaying, currentSong, user, startPlayingMusic, stopPlayingMusic]);

  const handleSeek = (value: number[]) => {
    const newTime = value[0];

    if (audioElement) {
      audioElement.currentTime = newTime;
      setProgress(newTime / audioElement.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolumeRef.current);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  return (
    <footer className="h-20 px-4 border-t sm:h-24 bg-zinc-900 border-zinc-800">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.song.imageUrl}
                alt={currentSong.song.title}
                className="object-cover rounded-md w-14 h-14"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate cursor-pointer hover:underline">
                  {currentSong.song.title}
                </div>
                <div className="text-sm truncate cursor-pointer text-zinc-400 hover:underline">
                  {currentSong.song.artist}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
              onClick={toggleShuffle}
              aria-label={isShuffled ? "Disable shuffle" : "Enable shuffle"}
            >
              <Shuffle
                className="w-4 h-4"
                fill={isShuffled ? "white" : "none"}
              />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              className="w-8 h-8 text-black bg-white rounded-full cursor-pointer hover:bg-white/80"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
              onClick={toggleRepeat}
              aria-label={isRepeated ? "Disable repeat" : "Enable repeat"}
            >
              <Repeat
                className="w-4 h-4"
                fill={isRepeated ? "white" : "none"}
              />
            </Button>
          </div>

          <div className="items-center hidden w-full gap-2 sm:flex">
            <div className="text-xs text-zinc-400">
              {formatTime(progress * duration)}
            </div>
            <Slider
              value={[progress * duration]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <Laptop2 className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : volume > 50 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <Volume1 className="w-4 h-4" />
              )}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
