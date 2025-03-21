import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useParams } from "react-router-dom";
import ParticleConnectionEffect from "@/components/animation/ParticlesAnime";
import { AlbumPageSkeleton } from "@/components/skeletons/AlbumSkeleton";
import { Clock, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const {
    currentSong,
    isPlaying,
    togglePlay,
    setCurrentSong,
    playNext,
    playPrevious,
    playAlbum,
  } = usePlayerStore();

  const { user } = useUser();
  const firstName = user?.firstName || "Guest";
  const selectedUser = {
    imageUrl: user?.imageUrl || "",
    fullName: user?.fullName || "",
  };

  // Fetch album data
  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  // Handle song click
  const handleSongClick = (index: number) => {
    const song = currentAlbum?.songs[index];
    if (song) {
      setCurrentSong(song, "album");
    }
  };

  // Handle next song
  const handleNextSong = () => {
    playNext();
  };

  // Handle previous song
  const handlePrevSong = () => {
    playPrevious();
  };

  // Handle play/pause button click
  const handlePlayPauseClick = () => {
    if (!currentAlbum?.songs) return;

    if (
      !currentSong ||
      currentSong.section !== "album" ||
      currentSong.song.albumId !== currentAlbum._id
    ) {
      // If no song is selected, or the current song is not from this album,
      // start playing the current album's songs from the first song
      playAlbum(currentAlbum.songs, 0);
    } else {
      // Otherwise, toggle play/pause
      togglePlay();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AlbumPageSkeleton />
      </div>
    );
  }

  if (!currentAlbum || !currentAlbum.songs) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <div>No Songs.</div> */}
      </div>
    );
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 pointer-events-none animate-gradient"
            aria-hidden="true"
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ParticleConnectionEffect id="album-particle-effect" />
          </div>
          <div className="relative z-10">
            <div className="flex gap-6 p-6 pb-8">
              <img
                src={currentAlbum.imageUrl}
                alt={currentAlbum.title}
                className="size-[100px] md:size-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="my-1 text-xl font-bold md:my-4 md:text-4xl lg:text-7xl">
                  {currentAlbum.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <div className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedUser.imageUrl} />
                      <AvatarFallback>
                        {selectedUser.fullName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="font-medium text-white">{firstName}</span>
                  <span>• {currentAlbum.songs.length} songs</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 pb-4 md:gap-6">
              <Button
                onClick={handlePrevSong}
                size="icon"
                className="w-12 h-12 transition-all bg-transparent rounded-full hover:bg-white/10"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </Button>

              <Button
                onClick={handlePlayPauseClick}
                size="icon"
                className={` size-8 md:size-14 rounded-full transition-all ${
                  isPlaying
                    ? "bg-emerald-500 hover:bg-emerald-500/90"
                    : "bg-emerald-600 hover:bg-emerald-600/90"
                }`}
              >
                {isPlaying ? (
                  <Pause className="text-white h-7 w-7" />
                ) : (
                  <Play className="text-white h-7 w-7" />
                )}
              </Button>

              <Button
                onClick={handleNextSong}
                size="icon"
                className="w-12 h-12 transition-all bg-transparent rounded-full hover:bg-white/10"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="py-4 space-y-2">
                  {currentAlbum.songs.map((song, index) => (
                    <div
                      key={song._id}
                      onClick={() => handleSongClick(index)}
                      className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer ${
                        currentSong?.song._id === song._id ? "bg-white/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {currentSong?.song._id === song._id && isPlaying ? (
                          <div className="text-green-500 size-4">♫</div>
                        ) : (
                          <span className="group-hover:hidden">
                            {index + 1}
                          </span>
                        )}
                        {currentSong?.song._id !== song._id && (
                          <Play className="hidden w-4 h-4 group-hover:block" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="size-10"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {song.title}
                          </div>
                          <div>{song.artist}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {song.createdAt.split("T")[0]}
                      </div>
                      <div className="flex items-center">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
