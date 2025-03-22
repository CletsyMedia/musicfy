import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { Song } from "@/types";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
  section: string;
};

const SectionGrid = ({
  songs,
  title,
  isLoading,
  section,
}: SectionGridProps) => {
  const { currentSong, progress } = usePlayerStore();

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold sm:text-xl">{title}</h2>
        <Button variant="link" className="text-sm text-zinc-400">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {songs.map((song) => {
          const isCurrentSong =
            currentSong?.song._id === song._id &&
            currentSong?.section === section;

          return (
            <div
              key={song._id}
              className={`bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative
                ${isCurrentSong}`}
            >
              <div className="relative mb-4">
                <div className="overflow-hidden rounded-md shadow-lg aspect-square">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <PlayButton song={song} section={section} />
              </div>
              <h3 className="mb-2 font-medium truncate">{song.title}</h3>
              <p className="text-sm truncate text-zinc-400">{song.artist}</p>

              {isCurrentSong && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-green-500"
                  style={{ width: `${progress * 100}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionGrid;
