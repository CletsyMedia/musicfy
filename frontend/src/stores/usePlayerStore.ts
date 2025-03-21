import { create } from "zustand";
import { Song } from "@/types";
import { useMusicStore } from "@/stores/useMusicStore";

interface PlayerState {
  currentSong: { song: Song; section: string } | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  audioElement: HTMLAudioElement | null;
  progress: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  isRepeated: boolean;
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], index: number) => void;
  cleanup?: () => void;
  setCurrentSong: (song: Song | null, section: string) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setShuffle: (isShuffled: boolean) => void;
  setRepeat: (isRepeated: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  audioElement: typeof Audio !== "undefined" ? new Audio() : null,
  progress: 0,
  duration: 0,
  volume: 75,
  isShuffled: false,
  isRepeated: false,

  initializeQueue: (songs: Song[]) =>
    set(() => ({
      queue: songs,
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
      currentSong: get().currentSong || { song: songs[0], section: "default" },
      isPlaying: true,
    })),

  playAlbum: (songs: Song[], index = 0) => {
    if (songs.length === 0) return;

    const song = songs[index];
    const audioElement = get().audioElement;

    if (audioElement) {
      audioElement.src = song.audioUrl;
      audioElement.play().catch((error) => {
        console.error("Failed to play song:", error);
      });

      const handleTimeUpdate = () => {
        const progress = audioElement.currentTime / audioElement.duration;
        get().setProgress(progress);
      };

      const handleLoadedMetadata = () => {
        get().setDuration(audioElement.duration);
      };

      const handleEnded = () => {
        get().playNext();
      };

      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("ended", handleEnded);

      const cleanup = () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioElement.removeEventListener("ended", handleEnded);
      };

      set({
        queue: songs,
        currentIndex: index,
        currentSong: { song, section: "album" },
        isPlaying: true,
        cleanup,
      });
    }
  },

  setCurrentSong: (song: Song | null, section: string) => {
    if (!song) return;

    const { currentSong, audioElement, cleanup } = get();

    if (currentSong && audioElement) {
      audioElement.pause();
      if (cleanup) {
        cleanup();
      }
    }

    let newQueue: Song[] = [];
    switch (section) {
      case "album":
        newQueue = useMusicStore.getState().currentAlbum?.songs || [];
        break;
      case "featured":
        newQueue = useMusicStore.getState().featuredSongs;
        break;
      case "made-for-you":
        newQueue = useMusicStore.getState().madeForYouSongs;
        break;
      case "trending":
        newQueue = useMusicStore.getState().trendingSongs;
        break;
      default:
        newQueue = get().queue;
        break;
    }

    const index = newQueue.findIndex((s) => s._id === song._id);

    if (audioElement) {
      audioElement.src = song.audioUrl;
      audioElement.play().catch((error) => {
        console.error("Failed to play song:", error);
      });

      const handleTimeUpdate = () => {
        const progress = audioElement.currentTime / audioElement.duration;
        get().setProgress(progress);
      };

      const handleLoadedMetadata = () => {
        get().setDuration(audioElement.duration);
      };

      const handleEnded = () => {
        get().playNext();
      };

      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("ended", handleEnded);

      const cleanup = () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioElement.removeEventListener("ended", handleEnded);
      };

      set({
        currentSong: { song, section },
        isPlaying: true,
        currentIndex: index !== -1 ? index : get().currentIndex,
        queue: newQueue,
        cleanup,
      });
    }
  },

  togglePlay: () => {
    const audioElement = get().audioElement;
    if (!audioElement) return;

    if (get().isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    set((state) => ({
      isPlaying: !state.isPlaying,
    }));
  },

  playNext: () => {
    const state = get();
    const { queue, currentIndex, isShuffled, isRepeated } = state;

    if (isRepeated) {
      const currentSong = queue[currentIndex];
      const audioElement = state.audioElement;

      if (audioElement) {
        audioElement.src = currentSong.audioUrl;
        audioElement.play().catch((error) => {
          console.error("Failed to play current song:", error);
        });
      }

      return;
    }

    let nextIndex = currentIndex + 1;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      const audioElement = state.audioElement;

      if (audioElement) {
        audioElement.src = nextSong.audioUrl;
        audioElement.play().catch((error) => {
          console.error("Failed to play next song:", error);
        });
      }

      set({
        currentIndex: nextIndex,
        currentSong: {
          song: nextSong,
          section: state.currentSong?.section || "album",
        },
        isPlaying: true,
      });
    } else {
      if (state.audioElement) {
        state.audioElement.pause();
      }
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const state = get();
    const prevIndex = state.currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = state.queue[prevIndex];
      const audioElement = state.audioElement;

      if (audioElement) {
        audioElement.src = prevSong.audioUrl;
        audioElement.play().catch((error) => {
          console.error("Failed to play previous song:", error);
        });
      }

      set({
        currentIndex: prevIndex,
        currentSong: {
          song: prevSong,
          section: state.currentSong?.section || "album",
        },
        isPlaying: true,
      });
    }
  },

  setProgress: (progress: number) => set({ progress }),
  setDuration: (duration: number) => set({ duration }),

  setVolume: (volume: number) => {
    const audioElement = get().audioElement;
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
    set({ volume });
  },

  setShuffle: (isShuffled: boolean) => set({ isShuffled }),

  setRepeat: (isRepeated: boolean) => set({ isRepeated }),

  toggleShuffle: () => {
    const { isShuffled, queue } = get();
    if (isShuffled) {
      set({ queue: [...queue].sort((a, b) => a._id.localeCompare(b._id)) });
    } else {
      const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
      set({ queue: shuffledQueue });
    }
    set({ isShuffled: !isShuffled });
  },

  toggleRepeat: () => {
    const { isRepeated } = get();
    set({ isRepeated: !isRepeated });
  },
}));
