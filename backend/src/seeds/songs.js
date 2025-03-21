import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
  {
    title: "Heading Home",
    artist: "Alan Walker",
    imageUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 210, // 3:30
  },
  {
    title: "In The Stars",
    artist: "Benson Boone",
    imageUrl: "/cover-images/2.jpeg",
    audioUrl: "/songs/2.mp3",
    duration: 241, // 4:01
  },
  {
    title: "Pointless",
    artist: "Lewis Capaldi",
    imageUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 229, // 3:49
  },
  {
    title: "Hold Me Like You Used Too",
    artist: "Zoe Wees",
    imageUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 187, // 3:07
  },
  {
    title: "Unstoppable",
    artist: "Sia",
    imageUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 214, // 3:34
  },
  {
    title: "Stay young",
    artist: "Mike Perry",
    imageUrl: "/cover-images/6.jpg",
    audioUrl: "/songs/6.mp3",
    duration: 198, // 2:38
  },
  {
    title: "Egwu",
    artist: "Chike Ft. Mohbad",
    imageUrl: "/cover-images/7.jpeg",
    audioUrl: "/songs/7.mp3",
    duration: 137, // 2:17
  },
  {
    title: "Tatoo",
    artist: "Loreen",
    imageUrl: "/cover-images/8.jpg",
    audioUrl: "/songs/8.mp3",
    duration: 184, // 3:04
  },
  {
    title: "Hotel Walls",
    artist: "Smith & Thell",
    imageUrl: "/cover-images/9.jpg",
    audioUrl: "/songs/9.mp3",
    duration: 207, // 3:28
  },
  {
    title: "Royalty",
    artist: "Egzod",
    imageUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/10.mp3",
    duration: 213, // 3:33
  },
  {
    title: "Wonderland",
    artist: "Axel Johansson",
    imageUrl: "/cover-images/11.jpg",
    audioUrl: "/songs/11.mp3",
    duration: 217, // 3:37
  },
  {
    title: "Who I Am",
    artist: "Alan Walker ft Putri Ariani, Peder Ellias",
    imageUrl: "/cover-images/12.jpeg",
    audioUrl: "/songs/12.mp3",
    duration: 194, // 3:14
  },
  {
    title: "This Is Me(Greatest Showman)",
    artist: "Alan Walker ft Keala Settle",
    imageUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/13.mp3",
    duration: 215, // 3:35
  },
  {
    title: "Lily",
    artist: "Alan Walker ft K-391 & Emelie Hollow",
    imageUrl: "/cover-images/14.jpg",
    audioUrl: "/songs/14.mp3",
    duration: 196, // 3:16
  },
  {
    title: "Fell in love with an alien",
    artist: "Mike Perry",
    imageUrl: "/cover-images/15.jpg",
    audioUrl: "/songs/15.mp3",
    duration: 176, // 2:56
  },
  {
    title: "Fight Song",
    artist: "Rachel Platten",
    imageUrl: "/cover-images/16.jpg",
    audioUrl: "/songs/16.mp3",
    duration: 206, // 3:26
  },
  {
    title: "Why I Love You",
    artist: "Major",
    imageUrl: "/cover-images/17.jpg",
    audioUrl: "/songs/17.mp3",
    duration: 237, // 3:57
  },
  {
    title: "I'll Be",
    artist: "Celine Dion",
    imageUrl: "/cover-images/18.webp",
    audioUrl: "/songs/18.mp3",
    duration: 184, // 3:04
  },
  {
    title: "Rockabye",
    artist: "Clean Bandit ft Sean Paul & Anne-Marie",
    imageUrl: "/cover-images/19.jpg",
    audioUrl: "/songs/29.mp3",
    duration: 250, // 4:10
  },
  {
    title: "Famy",
    artist: "Ava",
    imageUrl: "/cover-images/20.jpg",
    audioUrl: "/songs/20.mp3",
    duration: 242, // 4:02
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing songs
    await Song.deleteMany({});

    // Insert new songs
    await Song.insertMany(songs);

    console.log("Songs seeded successfully!");
  } catch (error) {
    console.error("Error seeding songs:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedSongs();
