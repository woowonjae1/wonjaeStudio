"use client";

import React, { useState, useRef, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import "./MusicCards.css";

interface MusicCardProps {
  title: string;
  description: string;
  imageSrc: string;
  audioSrc: string;
  isPlaying: boolean;
  onPlay: () => void;
}

const MusicCard = ({
  title,
  description,
  imageSrc,
  audioSrc,
  isPlaying,
  onPlay,
}: MusicCardProps) => {
  const hasAudio = audioSrc && audioSrc.length > 0;

  return (
    <CardContainer className="music-card-wrapper">
      <CardBody
        className={`music-card relative group/card w-auto sm:w-[20rem] h-auto rounded-xl p-5 ${isPlaying ? "is-playing" : ""}`}
      >
        <CardItem translateZ="50" className="music-card-title text-white">
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="music-card-description text-neutral-400 max-w-sm mt-2"
        >
          {description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4 relative">
          <img
            src={imageSrc}
            height="1000"
            width="1000"
            className={`music-card-image h-52 w-full object-cover ${isPlaying ? "playing" : ""}`}
            alt={title}
          />
          {isPlaying && (
            <div className="now-playing-indicator">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          )}
        </CardItem>
        <div className="flex justify-center items-center mt-6">
          {hasAudio ? (
            <CardItem
              translateZ={20}
              as="button"
              className={`play-button px-6 py-3 rounded-lg flex items-center gap-2 ${isPlaying ? "playing" : ""}`}
              onClick={onPlay}
            >
              {isPlaying ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Play
                </>
              )}
            </CardItem>
          ) : (
            <CardItem
              translateZ={20}
              className="coming-soon-label px-6 py-3 rounded-lg text-neutral-500 text-xs uppercase tracking-widest"
            >
              Coming Soon
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
};

const musicData = [
  // With audio - placed first
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
  // Without audio - display only
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

const MusicCards = () => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (index: number, audioSrc: string) => {
    if (currentPlaying === index) {
      // Pause current
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentPlaying(null);
    } else {
      // Stop previous and play new
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioSrc);
      audioRef.current.play();
      audioRef.current.onended = () => setCurrentPlaying(null);
      setCurrentPlaying(index);
    }
  };

  return (
    <section className="music-cards-section">
      <div className="music-cards-header">
        <h2 className="music-cards-title">Discography</h2>
        <p className="music-cards-subtitle">Explore the collection</p>
      </div>
      <div className="music-cards-grid">
        {musicData.map((music, index) => (
          <MusicCard
            key={index}
            title={music.title}
            description={music.description}
            imageSrc={music.imageSrc}
            audioSrc={music.audioSrc}
            isPlaying={currentPlaying === index}
            onPlay={() => handlePlay(index, music.audioSrc)}
          />
        ))}
      </div>
    </section>
  );
};

export default MusicCards;
