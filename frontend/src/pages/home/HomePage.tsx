import Navbar from "@/components/Navbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSongs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import SectionGrid from "./components/SectionGrid";
import { getGreetings } from "@/lib/utils";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYouSongs,
    isLoading,
    madeForYouSongs,
    trendingSongs,
  } = useMusicStore();

  const { user } = useUser();
  const firstName = user?.firstName || "Guest";

  useEffect(() => {
    fetchFeaturedSongs();
    fetchTrendingSongs();
    fetchMadeForYouSongs();
  }, [fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYouSongs]);

  return (
    <main className="flex flex-col h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      {/* Navbar */}
      <Navbar />

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6">
          <h1 className="mb-6 text-xl font-bold sm:text-3xl">
            {getGreetings()}, {firstName}
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title={`Made for you, ${firstName}`}
              songs={madeForYouSongs}
              isLoading={isLoading}
              section="made-for-you"
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
              section="trending"
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
