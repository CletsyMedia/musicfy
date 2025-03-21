import { Message } from "../models/message.model.js";

export const editMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the sender of this message" });
    }
    message.content = content;
    await message.save();
    res.json({ message: "Message updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user.id;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }
    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};
