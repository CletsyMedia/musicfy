import LoadSpinner from "@/components/LoadSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { AxiosInstance } from "@/lib/api/axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isLoaded:", isLoaded);
    console.log("user:", user);

    const syncUser = async () => {
      if (!isLoaded || !user) return;

      try {
        console.log("Syncing user data with backend...");
        const response = await AxiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
        console.log("Backend response:", response.data);

        console.log("Sync successful, redirecting to home...");
        navigate("/", { replace: true });
      } catch (error: any) {
        console.error(
          "Backend sync error:",
          error.response?.data || error.message
        );
        console.log("Sync failed, redirecting to home...");
        navigate("/", { replace: true });
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  // Handle the loading state
  if (!isLoaded || !user) {
    return (
      <div className="w-full bg-black flex items-center justify-center h-screen">
        <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <LoadSpinner />
            <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
            <p className="text-zinc-400 text-sm">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
