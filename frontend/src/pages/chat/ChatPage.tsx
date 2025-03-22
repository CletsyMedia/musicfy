import Topbar from "@/components/Navbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const {
    messages,
    selectedUser,
    fetchUsers,
    fetchMessages,
    editMessage,
    deleteMessage,
    markMessageAsRead,
  } = useChatStore();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedMessage(content);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!selectedUser || !user) return;
    editMessage(messageId, editedMessage, user.id, selectedUser.clerkId);
    setEditingMessageId(null);
    setEditedMessage("");
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedUser || !user) return;
    deleteMessage(messageId, user.id, selectedUser.clerkId);
  };

  const handleMarkAsRead = (messageId: string) => {
    if (!user) return;
    markMessageAsRead(messageId, user.id);
  };

  return (
    <main className="h-full overflow-hidden rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] sm:grid-cols-[80px_1fr] grid-cols-[60px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        {/* Chat Message Area */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?.id ? "justify-end" : ""
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <Avatar className="size-5">
                          <AvatarImage src={selectedUser.imageUrl} />
                        </Avatar>
                      )}

                      <div
                        className={`relative rounded-lg p-3 max-w-[70%] break-words overflow-wrap-break-word ${
                          message.senderId === user?.id
                            ? "bg-emerald-500/10"
                            : "bg-zinc-800"
                        }`}
                        style={{ wordBreak: "break-word" }}
                      >
                        {editingMessageId === message._id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={editedMessage}
                              onChange={(e) => setEditedMessage(e.target.value)}
                              className="w-full p-2 bg-transparent border rounded-md resize-none focus:outline-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(message._id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingMessageId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs sm:text-sm">
                              {message.content}
                            </p>
                            <span className="block mt-1.5 text-[9px] text-zinc-300">
                              {formatTime(message.createdAt)}
                            </span>
                          </>
                        )}

                        {/* Dropdown Menu for Message Actions */}
                        {message.senderId === user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute p-1 transition-colors rounded-full top-1 right-1 hover:bg-zinc-700/50">
                                <MoreVertical className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditMessage(
                                    message._id,
                                    message.content
                                  )
                                }
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-red-500"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {/* Mark as Read Button */}
                        {message.senderId !== user?.id &&
                          !message.readBy?.includes(user?.id || "") && (
                            <button
                              onClick={() => handleMarkAsRead(message._id)}
                              className="absolute p-1 transition-colors rounded-full bottom-1 right-1 hover:bg-zinc-700/50"
                            >
                              <Check className="size-4 text-emerald-500" />
                            </button>
                          )}

                        {/* Read Receipts */}
                        {message.readBy && message.readBy.length > 0 && (
                          <div className="mt-2 text-xs text-zinc-400">
                            Read by: {(message.readBy ?? []).join(", ")}
                          </div>
                        )}
                      </div>

                      {message.senderId === user?.id && (
                        <Avatar className="size-5">
                          <AvatarImage src={user.imageUrl} />
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/musicfy.png" alt="Musicfy" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="mb-1 text-sm font-medium sm:text-lg text-zinc-300">
        No conversation selected
      </h3>
      <p className="text-sm text-zinc-500">Choose a friend to start chatting</p>
    </div>
  </div>
);
