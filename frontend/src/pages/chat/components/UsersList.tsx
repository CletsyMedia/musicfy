import UsersListSkeleton from "@/components/skeletons/UserListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();

  return (
    <div className="border-r border-zinc-800">
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="p-1 sm:p-4 sm:space-y-2">
            {isLoading ? (
              <UsersListSkeleton />
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3
                    rounded-lg cursor-pointer transition-colors
                    ${
                      selectedUser?.clerkId === user.clerkId
                        ? "bg-zinc-800"
                        : "hover:bg-zinc-800/50"
                    }`}
                >
                  <div className="relative">
                    <Avatar className="size-6 sm:size-8 md:size-12">
                      <AvatarImage
                        src={user.imageUrl || ""}
                        alt={user.fullName || "User"}
                      />
                      <AvatarFallback>
                        {user.fullName ? user.fullName[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* online indicator */}
                    <div
                      className={`absolute bottom-0 right-0 size-1.5 sm:size-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.has(user.clerkId)
                            ? "bg-green-500"
                            : "bg-zinc-500"
                        }`}
                    />
                  </div>

                  <div className="flex-1 hidden min-w-0 lg:block">
                    <span className="font-medium truncate">
                      {user.fullName || "Anonymous"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-center sm:text-lg text-zinc-400">
                No users available.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
