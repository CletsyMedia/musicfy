import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String, //ClerkId
      required: true,
    },
    receiverId: {
      type: String, //ClerkId
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Message = mongoose.model("Message", messageSchema);
