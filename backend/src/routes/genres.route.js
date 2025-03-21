import { Router } from "express";
import { createGenre, getGenres } from "../controller/genres.controller.js";

const router = Router();

router.get("/", getGenres);
router.post("/create", createGenre);

export default router;
