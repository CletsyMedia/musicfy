import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSockets = new Map(); // { userId: socketId }
  const userActivities = new Map(); // { userId: activity }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user connection
    socket.on("user_connected", (userId) => {
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle"); // Initialize activity as "Idle"

      // Broadcast user connection and activities
      io.emit("user_connected", userId);
      io.emit("users_online", Array.from(userSockets.keys()));
      io.emit("activities", Array.from(userActivities.entries()));
    });

    // Handle activity updates
    socket.on("update_activity", ({ userId, activity }) => {
      console.log("Activity updated:", userId, activity);
      userActivities.set(userId, activity); // Update the user's activity
      io.emit("activity_updated", { userId, activity }); // Broadcast the updated activity
    });

    // Handle message sending
    socket.on("send_message", async ({ receiverId, senderId, content }) => {
      console.log("Received message payload:", {
        receiverId,
        senderId,
        content,
      });

      try {
        console.log("Attempting to save message to database...");

        // Validate the payload
        if (!receiverId || !senderId || !content) {
          throw new Error(
            "Invalid payload: receiverId, senderId, or content is missing"
          );
        }

        // Save the message to the database
        const message = await Message.create({ senderId, receiverId, content });
        console.log("Message saved to database:", message);

        // Check if the receiver is online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          console.log(`Receiver ${receiverId} is online. Emitting message...`);
          io.to(receiverSocketId).emit("receive_message", message); // Emit to receiver
        } else {
          console.log(`Receiver ${receiverId} is offline.`);
        }

        // Emit to sender
        socket.emit("message_sent", message);
        console.log("Message emitted to sender and receiver.");
      } catch (error) {
        console.error("Message save error:", error);

        // Emit an error event to the sender
        socket.emit("message_error", {
          error: "Failed to send message",
          details: error.message,
        });
      }
    });

    // Handle message editing
    socket.on(
      "edit_message",
      async ({ messageId, content, senderId, receiverId }) => {
        try {
          const message = await Message.findById(messageId);
          if (!message) {
            throw new Error("Message not found");
          }
          if (message.senderId.toString() !== senderId) {
            throw new Error("You are not authorized to edit this message");
          }

          const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { content },
            { new: true }
          );

          const receiverSocketId = userSockets.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_edited", updatedMessage);
          }
          socket.emit("message_edited", updatedMessage);
        } catch (error) {
          console.error("Error editing message:", error);
          socket.emit("message_error", {
            error: "Failed to edit message",
            details: error.message,
          });
        }
      }
    );

    // Handle message deletion
    socket.on("delete_message", async ({ messageId, senderId, receiverId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          throw new Error("Message not found");
        }
        if (message.senderId.toString() !== senderId) {
          throw new Error("You are not authorized to delete this message");
        }

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message_deleted", { messageId });
        }
        socket.emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("message_error", {
          error: "Failed to delete message",
          details: error.message,
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
        console.log(`User ${disconnectedUserId} disconnected.`);
      }
    });
  });
};
