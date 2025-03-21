import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Genre } from "../models/genre.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Album.deleteMany({});
    await Song.deleteMany({});
    await Genre.deleteMany({});

    const genres = await Genre.insertMany([
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
    ]);

    const createdSongs = await Song.insertMany([
      {
        title: "Heading Home",
        artist: "Alan Walker",
        imageUrl: "/cover-images/1.jpg",
        audioUrl: "/songs/1.mp3",
        duration: 210,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "In The Stars",
        artist: "Benson Boone",
        imageUrl: "/cover-images/2.jpeg",
        audioUrl: "/songs/2.mp3",
        duration: 241,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Pointless",
        artist: "Lewis Capaldi",
        imageUrl: "/cover-images/3.jpg",
        audioUrl: "/songs/3.mp3",
        duration: 229,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Hold Me Like You Used Too",
        artist: "Zoe Wees",
        imageUrl: "/cover-images/4.jpg",
        audioUrl: "/songs/4.mp3",
        duration: 187,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Unstoppable",
        artist: "Sia",
        imageUrl: "/cover-images/5.jpg",
        audioUrl: "/songs/5.mp3",
        duration: 214,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Stay young",
        artist: "Mike Perry",
        imageUrl: "/cover-images/6.jpg",
        audioUrl: "/songs/6.mp3",
        duration: 198,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Egwu",
        artist: "Chike Ft. Mohbad",
        imageUrl: "/cover-images/7.jpeg",
        audioUrl: "/songs/7.mp3",
        duration: 137,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Tatoo",
        artist: "Loreen",
        imageUrl: "/cover-images/8.jpg",
        audioUrl: "/songs/8.mp3",
        duration: 184,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Hotel Walls",
        artist: "Smith & Thell",
        imageUrl: "/cover-images/9.jpg",
        audioUrl: "/songs/9.mp3",
        duration: 207,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Royalty",
        artist: "Egzod",
        imageUrl: "/cover-images/10.jpg",
        audioUrl: "/songs/10.mp3",
        duration: 213,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Wonderland",
        artist: "Axel Johansson",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/11.mp3",
        duration: 217,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Who I Am",
        artist: "Alan Walker ft Putri Ariani, Peder Ellias",
        imageUrl: "/cover-images/12.jpeg",
        audioUrl: "/songs/12.mp3",
        duration: 194,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "This Is Me(Greatest Showman)",
        artist: "Alan Walker ft Keala Settle",
        imageUrl: "/cover-images/13.jpg",
        audioUrl: "/songs/13.mp3",
        duration: 215,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Lily",
        artist: "Alan Walker ft K-391 & Emelie Hollow",
        imageUrl: "/cover-images/14.jpg",
        audioUrl: "/songs/14.mp3",
        duration: 196,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Fell in love with an alien",
        artist: "Mike Perry",
        imageUrl: "/cover-images/15.jpg",
        audioUrl: "/songs/15.mp3",
        duration: 176,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Fight Song",
        artist: "Rachel Platten",
        imageUrl: "/cover-images/16.jpg",
        audioUrl: "/songs/16.mp3",
        duration: 206,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Why I Love You",
        artist: "Major",
        imageUrl: "/cover-images/17.jpg",
        audioUrl: "/songs/17.mp3",
        duration: 237,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "I'll Be",
        artist: "Celine Dion",
        imageUrl: "/cover-images/18.webp",
        audioUrl: "/songs/18.mp3",
        duration: 184,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Rockabye",
        artist: "Clean Bandit ft Sean Paul & Anne-Marie",
        imageUrl: "/cover-images/19.jpg",
        audioUrl: "/songs/19.mp3",
        duration: 250,
        plays: Math.floor(Math.random() * 5000),
      },
      {
        title: "Famy",
        artist: "Ava",
        imageUrl: "/cover-images/20.jpg",
        audioUrl: "/songs/20.mp3",
        duration: 242,
        plays: Math.floor(Math.random() * 5000),
      },
    ]);

    const albums = [
      {
        title: "Electronic Vibes",
        artist: "Various Artists",
        imageUrl: "/albums/1.jpg",
        releaseYear: 2025,
        genre: genres[5]._id, // Electronic
        songs: createdSongs.slice(0, 5).map((song) => song._id),
      },
      {
        title: "Pop Anthems",
        artist: "Various Artists",
        imageUrl: "/albums/2.jpg",
        releaseYear: 2025,
        genre: genres[0]._id, // Pop
        songs: createdSongs.slice(5, 10).map((song) => song._id),
      },
      {
        title: "Melodic Journeys",
        artist: "Various Artists",
        imageUrl: "/albums/3.jpg",
        releaseYear: 2025,
        genre: genres[0]._id, // Pop
        songs: createdSongs.slice(10, 15).map((song) => song._id),
      },
      {
        title: "Powerful Ballads",
        artist: "Various Artists",
        imageUrl: "/albums/4.jpg",
        releaseYear: 2025,
        genre: genres[0]._id, // Pop
        songs: createdSongs.slice(15, 20).map((song) => song._id),
      },
    ];

    const createdAlbums = await Album.insertMany(albums);

    for (let i = 0; i < createdAlbums.length; i++) {
      const album = createdAlbums[i];
      const albumSongs = albums[i].songs;

      await Song.updateMany(
        { _id: { $in: albumSongs } },
        { $set: { albumId: album._id } }
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
