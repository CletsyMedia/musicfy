import { AxiosInstance } from "@/lib/api/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  adminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: localStorage.getItem("isAdmin") === "true",
  isLoading: true,
  error: null,

  adminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/admin/check");
      console.log("API Response:", response.data);
      const isAdmin = response.data.isAdmin;
      localStorage.setItem("isAdmin", isAdmin.toString()); // Sync with localStorage
      set({ isAdmin });
    } catch (error: any) {
      console.error("Error fetching admin status:", error);
      set({
        isAdmin: false,
        error: error.response?.data?.message || "An error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    localStorage.removeItem("isAdmin"); // Clear localStorage
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
