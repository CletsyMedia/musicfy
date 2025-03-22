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
import { Helmet } from "react-helmet";

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
    <div className="min-h-screen p-3 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 md:p-8">
      {/* Add SEO Meta Tags */}
      <Helmet>
        <title>Admin Dashboard - Musicfy</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Manage your Musicfy admin dashboard. View and manage songs, albums, and statistics. Stay in control of your music streaming platform."
        />
        <meta
          name="keywords"
          content="Musicfy, admin, dashboard, manage songs, manage albums, music statistics, music streaming"
        />
        <meta property="og:title" content="Admin Dashboard - Musicfy" />
        <meta
          property="og:description"
          content="Manage your Musicfy admin dashboard. View and manage songs, albums, and statistics. Stay in control of your music streaming platform."
        />
        <meta
          property="og:image"
          content="https://musicfy-zvck.onrender.com/logo.png"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://musicfy-zvck.onrender.com/admin"
        />
        <link rel="canonical" href="https://musicfy-zvck.onrender.com/admin" />
      </Helmet>
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
