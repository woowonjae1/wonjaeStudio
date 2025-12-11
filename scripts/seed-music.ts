import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const musicData = [
  {
    title: "Crush",
    description: "Heart breaking emotions in every beat",
    imageSrc: "/image/HeartBreaking.jpg",
    audioSrc: "/audio/禹元宰 - Crush.mp3",
  },
  {
    title: "傍晚的 Romantic",
    description: "Evening romance, Qixi vibes",
    imageSrc: "/image/Romantic.jpg",
    audioSrc: "/audio/禹元宰 - 傍晚的Romantic.mp3",
  },
  {
    title: "Nobody Gets Me",
    description: "R&B type beat, deep connection",
    imageSrc: "/image/nobodygetsme.jpg",
    audioSrc: "/audio/禹元宰 - Nobody Gets Me Like u R&B TYPE BEAT.mp3",
  },
  {
    title: "Can't Chat With You",
    description: "Unspoken feelings, silent nights",
    imageSrc: "/image/Artlife.jpg",
    audioSrc: "/audio/禹元宰 - [Free]%23cant chat with you.mp3",
  },
  {
    title: "Summer",
    description: "Feel the warmth of summer vibes",
    imageSrc: "/image/Summer.jpg",
    audioSrc: "",
  },
  {
    title: "Pink Blue",
    description: "Dreamy aesthetic soundscapes",
    imageSrc: "/image/PinkBlue.jpg",
    audioSrc: "",
  },
  {
    title: "Entity Life",
    description: "Explore the essence of life",
    imageSrc: "/image/entityLife.jpg",
    audioSrc: "",
  },
  {
    title: "Blue Groove",
    description: "Chill blue groove beats",
    imageSrc: "/image/iambluegroove.jpg",
    audioSrc: "",
  },
];

async function seedMusic() {
  try {
    console.log("Seeding music data...");

    const { data, error } = await supabase.from("music_tracks").insert(
      musicData.map((track, index) => ({
        title: track.title,
        description: track.description,
        image_url: track.imageSrc,
        audio_url: track.audioSrc || null,
        display_order: index,
        play_count: 0,
      }))
    );

    if (error) {
      console.error("Error seeding music:", error);
      process.exit(1);
    }

    console.log("✓ Successfully seeded", musicData.length, "tracks");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedMusic();
