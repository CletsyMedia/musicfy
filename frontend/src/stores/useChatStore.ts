import { AxiosInstance } from "@/lib/api/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  editMessage: (
    messageId: string,
    content: string,
    senderId: string,
    receiverId: string
  ) => void;
  deleteMessage: (
    messageId: string,
    senderId: string,
    receiverId: string
  ) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  markMessageAsRead: (messageId: string, userId: string) => void;
  startPlayingMusic: (
    userId: string,
    songTitle: string,
    artist: string
  ) => void;
  stopPlayingMusic: (userId: string) => void;
}

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_edited", (updatedMessage: Message) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          ),
        }));
      });

      socket.on("message_deleted", ({ messageId }: { messageId: string }) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      socket.on("message_read", ({ messageId, userId }) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message._id === messageId
              ? { ...message, readBy: [...(message.readBy || []), userId] }
              : message
          ),
        }));
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", { receiverId, senderId, content });
  },

  editMessage: async (messageId, content, senderId, receiverId) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("edit_message", { messageId, content, senderId, receiverId });
  },

  deleteMessage: async (messageId, senderId, receiverId) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("delete_message", { messageId, senderId, receiverId });
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AxiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  markMessageAsRead: (messageId, userId) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message._id === messageId
          ? { ...message, readBy: [...(message.readBy || []), userId] }
          : message
      ),
    }));
  },

  startPlayingMusic: (userId, songTitle, artist) => {
    const socket = get().socket;
    if (!socket) return;

    const activity = `Playing ${songTitle} by ${artist}`;
    socket.emit("update_activity", { userId, activity });
  },

  stopPlayingMusic: (userId) => {
    const socket = get().socket;
    if (!socket) return;

    const activity = "Idle";
    socket.emit("update_activity", { userId, activity });
  },
}));
