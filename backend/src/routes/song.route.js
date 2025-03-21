import { Router } from "express";
import {
  featuredSongs,
  getAllSong,
  getMadeForYouSongs,
  trendingSongs,
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSong);
router.get("/featured", featuredSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", trendingSongs);

export default router;
