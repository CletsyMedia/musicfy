import { Genre } from "../models/genre.model.js";

export const getGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
};

export const createGenre = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const existingGenre = await Genre.findOne({ name: name.toLowerCase() });
    if (existingGenre) {
      return res.status(400).json({
        message: "Genre already exists",
      });
    }
    const newGenre = new Genre({ name, description });
    await newGenre.save();
    return res.status(201).json(newGenre);
  } catch (error) {
    next(error);
  }
};
