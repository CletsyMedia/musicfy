import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="flex flex-col h-full rounded-lg bg-zinc-900">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they're listening to</h2>
        </div>
      </div>

      {!user && <LoginPrompt />}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users && users.length > 0 ? (
            users.map((user) => {
              const activity = userActivities.get(user.clerkId);
              const isOnline = onlineUsers.has(user.clerkId);
              const isPlaying = activity && activity !== "Idle";

              return (
                <div
                  key={user._id}
                  className="p-3 transition-colors rounded-md cursor-pointer hover:bg-zinc-800/50 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="border size-10 border-zinc-800">
                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName ? user.fullName[0] : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900
                          ${isOnline ? "bg-green-500" : "bg-zinc-500"}
                        `}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {user.fullName}
                        </span>
                        {isPlaying && (
                          <Music className="size-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>

                      {isOnline ? (
                        isPlaying ? (
                          <div className="mt-1">
                            <div className="mt-1 text-sm font-medium text-white truncate">
                              {
                                activity
                                  .replace("Playing ", "")
                                  .split(" by ")[0]
                              }
                            </div>
                            <div className="text-xs truncate text-zinc-400">
                              {activity.split(" by ")[1]}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-zinc-400">Idle</div>
                        )
                      ) : (
                        <div className="mt-1 text-xs text-zinc-400">
                          Offline
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-zinc-400">No users available.</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 text-center">
    <div className="relative">
      <div
        className="absolute rounded-full opacity-75 -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 blur-lg animate-pulse"
        aria-hidden="true"
      />
      <div className="relative p-4 rounded-full bg-zinc-900">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        See What Friends Are Playing
      </h3>
      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
