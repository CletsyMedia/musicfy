import { clerkClient } from "@clerk/express";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Genre } from "../models/genre.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createGenre = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const genre = new Genre({
      name,
      description,
    });
    await genre.save();
    res.status(201).json({ genre });
  } catch (error) {
    console.log("Error creating genre", error);
    next(error);
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Please upload both audio and image files" });
    }

    const { title, artist, albumId, genreId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      album: albumId || null,
      genre: genreId || null,
      duration,
    });

    // Save the song to the database
    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    // Return the created song in the response
    res.status(201).json({ song });
  } catch (error) {
    console.log("Error creating song", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error deleting song", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, genre, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);

    // Validate genre
    const existingGenre = await Genre.findById(genre);
    if (!existingGenre) {
      return res.status(400).json({ message: "Invalid genre" });
    }

    const album = new Album({
      title,
      artist,
      genre: existingGenre._id,
      releaseYear,
      imageUrl,
    });

    await album.save();
    res.status(201).json({ album });
  } catch (error) {
    console.log("Error creating album", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Album.findByIdAndDelete(id);
    await Song.deleteMany({ album: id });
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error deleting album", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    res.status(200).json({ isAdmin });
  } catch (error) {
    next(error);
  }
};
