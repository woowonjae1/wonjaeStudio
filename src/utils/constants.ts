import { Album } from "@/types";

// 专辑数据
export const ALBUMS: Album[] = [
  {
    id: "1",
    title: "Romantic Album",
    artist: "Woowonjae",
    coverUrl: "/image/Romantic.jpg",
    audioSrc: "/audio/禹元宰 - 傍晚的Romantic.mp3",
    year: 2023,
    description: "浪漫主题的专辑，融合了R&B和Pop元素。",
    tracks: [
      { id: "1-1", title: "傍晚的Romantic", duration: "3:21" },
      { id: "1-2", title: "Love Story", duration: "3:45" },
      { id: "1-3", title: "Midnight Thoughts", duration: "4:02" }
    ]
  },
  {
    id: "2",
    title: "Art Life Album",
    artist: "Woowonjae",
    coverUrl: "/image/Artlife.jpg",
    audioSrc: "/audio/禹元宰 - Crush.mp3",
    year: 2023,
    description: "艺术生活主题的专辑，展现都市生活的艺术感。",
    tracks: [
      { id: "2-1", title: "Crush", duration: "3:18" },
      { id: "2-2", title: "City Lights", duration: "3:55" },
      { id: "2-3", title: "Artistic Flow", duration: "4:12" }
    ]
  },
  {
    id: "3",
    title: "Heart Breaking Album",
    artist: "Woowonjae",
    coverUrl: "/image/HeartBreaking.jpg",
    audioSrc: "/audio/禹元宰 - [Free]#cant chat with you.mp3",
    year: 2024,
    description: "表达心碎情感的专辑，深入探索感情的复杂性。",
    tracks: [
      { id: "3-1", title: "Can't Chat With You", duration: "3:40" },
      { id: "3-2", title: "Broken Pieces", duration: "4:05" },
      { id: "3-3", title: "After Rain", duration: "3:50" }
    ]
  },
  {
    id: "4",
    title: "Nobody Gets Me Album",
    artist: "Woowonjae",
    coverUrl: "/image/nobodygetsme.jpg",
    audioSrc: "/audio/禹元宰 - Nobody Gets Me Like u R&B TYPE BEAT.mp3",
    year: 2024,
    description: "探索个人独特性的R&B风格专辑。",
    tracks: [
      { id: "4-1", title: "Nobody Gets Me Like U", duration: "4:10" },
      { id: "4-2", title: "Unique Soul", duration: "3:55" },
      { id: "4-3", title: "My Way", duration: "4:25" }
    ]
  },
  {
    id: "5",
    title: "Summer Nights",
    artist: "Woowonjae",
    coverUrl: "/image/Summer.jpg",
    audioSrc: "/audio/禹元宰 - 傍晚的Romantic.mp3",
    year: 2023,
    description: "夏日夜晚主题的轻松愉快专辑。",
    tracks: [
      { id: "5-1", title: "Summer Breeze", duration: "3:30" },
      { id: "5-2", title: "Sunset Vibes", duration: "3:45" },
      { id: "5-3", title: "Beach Dreams", duration: "4:10" }
    ]
  },
  {
    id: "6",
    title: "City View",
    artist: "Woowonjae",
    coverUrl: "/image/entityLife.jpg",
    audioSrc: "/audio/禹元宰 - Crush.mp3",
    year: 2023,
    description: "城市景观启发的现代电子音乐专辑。",
    tracks: [
      { id: "6-1", title: "Downtown", duration: "3:25" },
      { id: "6-2", title: "Skyline", duration: "4:15" },
      { id: "6-3", title: "Urban Dreams", duration: "3:50" }
    ]
  },
  {
    id: "7",
    title: "Blue Groove",
    artist: "Woowonjae",
    coverUrl: "/image/iambluegroove.jpg",
    audioSrc: "/audio/禹元宰 - [Free]#cant chat with you.mp3",
    year: 2024,
    description: "蓝调风格的节奏专辑，充满感性。",
    tracks: [
      { id: "7-1", title: "Blue Mood", duration: "4:05" },
      { id: "7-2", title: "Rhythm & Blues", duration: "3:40" },
      { id: "7-3", title: "Deep Ocean", duration: "4:30" }
    ]
  },
  {
    id: "8",
    title: "Pink & Blue",
    artist: "Woowonjae",
    coverUrl: "/image/PinkBlue.jpg",
    audioSrc: "/audio/禹元宰 - Nobody Gets Me Like u R&B TYPE BEAT.mp3",
    year: 2024,
    description: "色彩主题的梦幻电子音乐专辑。",
    tracks: [
      { id: "8-1", title: "Color Spectrum", duration: "3:35" },
      { id: "8-2", title: "Dream in Color", duration: "4:20" },
      { id: "8-3", title: "Pastel Skies", duration: "3:55" }
    ]
  }
];