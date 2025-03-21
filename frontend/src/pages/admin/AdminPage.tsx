import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import AdminDashboardStats from "./components/AdminDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Music } from "lucide-react";
import SongsContent from "./components/SongsContent";
import AlbumsContent from "./components/AlbumsContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import ErrorPage from "../404/ErrorPage";
import HeaderSkeleton from "@/components/skeletons/HeaderSkeleton";
import DashboardStatsSkeleton from "@/components/skeletons/DashboardStatSkeleton";
import TabsListSkeleton from "@/components/skeletons/TablistSkeleton";
import TableHeaderSkeleton from "@/components/skeletons/TableHeaderSkeleton";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();

  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchStats, fetchSongs]);

  if (!isAdmin && !isLoading) {
    return (
      <ErrorPage
        errorCode="404"
        errorMessage="Access Denied"
        customMessage="Looks like you were lost in the shuffle. Let's get you back to the music."
        icon={Music}
        showButtons={["goBack", "home"]}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8"
    >
      {isLoading ? <HeaderSkeleton /> : <Header />}

      {isLoading ? <DashboardStatsSkeleton /> : <AdminDashboardStats />}

      <Tabs defaultValue="songs" className="space-y-6">
        {isLoading ? (
          <TabsListSkeleton />
        ) : (
          <>
            <TabsList className="p-1 bg-zinc-800/50">
              <TabsTrigger
                value="songs"
                className="data-[state=active]:bg-zinc-700"
              >
                <Music className="mr-2 size-4" />
                Song
              </TabsTrigger>
              <TabsTrigger
                value="albums"
                className="data-[state=active]:bg-zinc-700"
              >
                <Album className="mr-2 size-4" />
                Album
              </TabsTrigger>
            </TabsList>
          </>
        )}
        {isLoading ? (
          <TableHeaderSkeleton />
        ) : (
          <>
            <TabsContent value="songs">
              <SongsContent />
            </TabsContent>
            <TabsContent value="albums">
              <AlbumsContent />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPage;
