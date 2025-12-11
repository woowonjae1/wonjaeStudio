"use client";

import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { getTrackPlayCount, formatPlayCount } from "@/lib/playCountStorage";
import "./MusicCards.css";

interface MusicCardProps {
  title: string;
  description: string;
  imageSrc: string;
  audioSrc: string;
  isPlaying: boolean;
  playCount: number;
  onPlay: () => void;
}

const MusicCard = ({
  title,
  description,
  imageSrc,
  audioSrc,
  isPlaying,
  playCount,
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
        {hasAudio && playCount > 0 && (
          <CardItem
            translateZ="40"
            className="music-card-plays text-neutral-500 text-xs mt-1"
          >
            {formatPlayCount(playCount)} plays
          </CardItem>
        )}
        <CardItem translateZ="100" className="w-full mt-4 relative">
          <img
            src={imageSrc}
            height="1000"
            width="1000"
            loading="lazy"
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

// Fallback data when API is unavailable
const fallbackMusicData: Track[] = [];

interface Track {
  title: string;
  description: string;
  imageSrc: string;
  audioSrc: string;
}

const MusicCards = () => {
  const {
    play,
    pause,
    isPlaying,
    currentTrackIndex,
    setPlaylist,
    playAll,
    totalPlays,
  } = useMusicPlayer();
  const [musicData, setMusicData] = useState<Track[]>(fallbackMusicData);
  const [playCounts, setPlayCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const tracksWithAudio = musicData.filter((track) => track.audioSrc);

  // Fetch tracks from API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/music");
        const data = await res.json();
        if (data.tracks && data.tracks.length > 0) {
          setMusicData(data.tracks);
        }
      } catch (error) {
        console.error("Failed to fetch tracks, using fallback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (!loading) {
      setPlaylist(tracksWithAudio);

      // Load play counts for all tracks
      const counts: { [key: string]: number } = {};
      musicData.forEach((track) => {
        counts[track.title] = getTrackPlayCount(track.title);
      });
      setPlayCounts(counts);
    }
  }, [loading, musicData]);

  // Update play counts when totalPlays changes
  useEffect(() => {
    const counts: { [key: string]: number } = {};
    musicData.forEach((track) => {
      counts[track.title] = getTrackPlayCount(track.title);
    });
    setPlayCounts(counts);
  }, [totalPlays, musicData]);

  const handlePlay = (index: number) => {
    if (currentTrackIndex === index && isPlaying) {
      pause();
    } else {
      play(tracksWithAudio[index], index);
    }
  };

  return (
    <section className="music-cards-section">
      <div className="music-cards-header">
        <h2 className="music-cards-title">Discography</h2>
        <p className="music-cards-subtitle">Explore the collection</p>
        {tracksWithAudio.length > 0 && (
          <button className="play-all-button" onClick={playAll}>
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
            Play All
          </button>
        )}
      </div>
      <div className="music-cards-grid">
        {musicData.map((music, index) => {
          const trackIndex = tracksWithAudio.findIndex(
            (t) => t.audioSrc === music.audioSrc
          );
          const isCurrentlyPlaying =
            trackIndex !== -1 && trackIndex === currentTrackIndex && isPlaying;

          return (
            <MusicCard
              key={index}
              title={music.title}
              description={music.description}
              imageSrc={music.imageSrc}
              audioSrc={music.audioSrc}
              isPlaying={isCurrentlyPlaying}
              playCount={playCounts[music.title] || 0}
              onPlay={() => trackIndex !== -1 && handlePlay(trackIndex)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default MusicCards;
