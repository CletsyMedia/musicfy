import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  editMessage,
  deleteMessage,
} from "../controller/message.controller.js";

const router = Router();

router.put("/:messageId", protectRoute, editMessage);
router.patch("/:messageId", protectRoute, editMessage);
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;
