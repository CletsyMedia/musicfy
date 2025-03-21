import { AxiosInstance } from "@/lib/api/axios";
import { Album, Genre, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  albums: Album[];
  songs: Song[];
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  featuredSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  searchTerm: string;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchGenres: () => Promise<void>;
  getAlbumsWithGenres: () => any[];
  fetchFeaturedSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deletingSong: (songId: string) => Promise<void>;
  deletingAlbum: (albumId: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  genres: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    totalUsers: 0,
  },
  searchTerm: "",

  setSearchTerm: (term) => set({ searchTerm: term }),
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  deletingSong: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      await AxiosInstance.delete(`/admin/songs/${songId}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== songId), // Remove the deleted song
        stats: {
          ...state.stats,
          totalSongs: state.stats.totalSongs - 1, // Decrement totalSongs
        },
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete song");
      set({ error: error.response?.data?.message || "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  deletingAlbum: async (albumId) => {
    set({ isLoading: true, error: null });
    try {
      await AxiosInstance.delete(`/admin/albums/${albumId}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumId === albumId ? { ...song, albumId: null } : song
        ),
        stats: {
          ...state.stats,
          totalAlbums: state.stats.totalAlbums - 1, // Decrement totalAlbums
        },
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album");
      set({ error: error.response?.data?.message || "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/albums");
      set({ albums: response.data.albums });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (albumId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get(`/albums/${albumId}`);
      console.log("API Response:", response.data);
      set({ currentAlbum: response.data.album });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/genres");
      set({ genres: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  getAlbumsWithGenres: () => {
    const { albums, genres } = get();
    return albums.map((album) => {
      const genre = genres.find((g) => g._id === album.genre);
      return {
        ...album,
        genre: genre || null, // Replace genre ID with the full genre object
      };
    });
  },
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
