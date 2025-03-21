import LoadSpinner from "@/components/LoadSpinner";
import { AxiosInstance } from "@/lib/api/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { ReactNode, useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("clerk_session_token", token);
  } else {
    delete AxiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("clerk_session_token");
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [loading, setIsLoading] = useState(true);
  const { adminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!authLoaded || !userLoaded) return;

        const token = await getToken();
        updateApiToken(token);

        if (user && token) {
          // Sync user with backend in the background
          await AxiosInstance.post("/auth/callback", {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          });
          await adminStatus(); // Check admin status if needed
          //   Init socket connection
          if (user && user.id) {
            initSocket(user.id);
          }
        }
      } catch (error: any) {
        console.error("Error in AuthProvider:", error);
        updateApiToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // Close connect
    return () => disconnectSocket();
  }, [
    getToken,
    authLoaded,
    userLoaded,
    user,
    adminStatus,
    user?.id,
    initSocket,
    disconnectSocket,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadSpinner />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
