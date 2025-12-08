"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import "./MusicCards.css";

interface MusicCardProps {
  title: string;
  description: string;
  imageSrc: string;
  onPlay?: () => void;
}

const MusicCard = ({
  title,
  description,
  imageSrc,
  onPlay,
}: MusicCardProps) => {
  return (
    <CardContainer className="music-card-wrapper">
      <CardBody className="music-card relative group/card w-auto sm:w-[18rem] h-auto rounded-xl p-5">
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
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={imageSrc}
            height="1000"
            width="1000"
            className="music-card-image h-44 w-full object-cover"
            alt={title}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="a"
            href="#"
            className="listen-link px-3 py-2 rounded-lg text-white"
          >
            Listen →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="play-button px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={onPlay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            Play
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

const musicData = [
  {
    title: "Summer",
    description: "Feel the warmth of summer vibes",
    imageSrc: "/image/Summer.jpg",
  },
  {
    title: "Romantic",
    description: "Love songs for your heart",
    imageSrc: "/image/Romantic.jpg",
  },
  {
    title: "Pink Blue",
    description: "Dreamy aesthetic soundscapes",
    imageSrc: "/image/PinkBlue.jpg",
  },
  {
    title: "Nobody Gets Me",
    description: "Deep emotional journey",
    imageSrc: "/image/nobodygetsme.jpg",
  },
  {
    title: "Heart Breaking",
    description: "Songs that touch your soul",
    imageSrc: "/image/HeartBreaking.jpg",
  },
  {
    title: "I Am Blue Groove",
    description: "Chill blue groove beats",
    imageSrc: "/image/iambluegroove.jpg",
  },
  {
    title: "Entity Life",
    description: "Explore the essence of life",
    imageSrc: "/image/entityLife.jpg",
  },
];

const MusicCards = () => {
  const handlePlay = (title: string) => {
    console.log(`Playing: ${title}`);
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
            onPlay={() => handlePlay(music.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default MusicCards;
