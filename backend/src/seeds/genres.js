import mongoose from "mongoose";
import { Genre } from "../models/genre.model.js";

import { config } from "dotenv";

config();

const genres = [
  { name: "Pop", description: "A genre of popular music." },
  {
    name: "Rock",
    description:
      "A genre of music characterized by a strong beat and simple melodies.",
  },
  {
    name: "Jazz",
    description:
      "A music genre that originated from African American communities.",
  },
  {
    name: "Classical",
    description: "A genre of music rooted in Western traditions.",
  },
  {
    name: "Hip-Hop",
    description: "A music genre defined by rhythmic music and rapping.",
  },
  {
    name: "Electronic",
    description: "A genre of music that involves digital audio production.",
  },
  {
    name: "Blues",
    description: "A genre of music with roots in African-American culture.",
  },
];

const seedGenres = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing genres
    await Genre.deleteMany({});

    // Insert new genres
    await Genre.insertMany(genres);

    console.log("Genres seeded successfully!");
  } catch (error) {
    console.error("Error seeding genres:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedGenres();
