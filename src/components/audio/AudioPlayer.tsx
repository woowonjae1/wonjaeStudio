import React, { useEffect, useState } from 'react';
import { Album } from '@/types';

interface AudioPlayerProps {
  album: Album;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ album, isPlaying, onPlayPause, audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={album.image} 
            alt={album.title} 
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div>
            <h3 className="font-semibold text-lg">{album.title}</h3>
            <p className="text-gray-600">{album.artist}</p>
          </div>
        </div>

        <div className="flex-1 mx-8">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={onPlayPause}
              className="p-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = Number(e.target.value) / 100;
              }
            }}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;