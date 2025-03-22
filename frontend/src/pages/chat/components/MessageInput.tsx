import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) {
      console.error("Missing required fields:", {
        selectedUser,
        user,
        newMessage,
      });
      return;
    }
    console.log("Sending message with payload:", {
      receiverId: selectedUser.clerkId,
      senderId: user.id,
      content: newMessage.trim(),
    });
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.shiftKey || e.metaKey)) {
      setNewMessage((prev) => prev + "");
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [newMessage]);

  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 transition-all border-none rounded-md resize-none bg-zinc-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ overflow: "hidden" }} // Prevent scrollbar
        />

        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <Send className="size-2 sm:size-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
