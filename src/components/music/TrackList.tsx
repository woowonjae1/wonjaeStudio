"use client";

import React from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string | null;
  onTrackClick: (track: Track) => void;
  showHeader?: boolean;
}

export default function TrackList({
  tracks,
  currentTrackId,
  onTrackClick,
  showHeader = true,
}: TrackListProps) {
  return (
    <div className="w-full">
      <table className="track-list">
        {showHeader && (
          <thead className="track-list-header">
            <tr>
              <th>#</th>
              <th>标题</th>
              <th>艺术家</th>
              <th>时长</th>
            </tr>
          </thead>
        )}
        <tbody>
          {tracks.map((track, index) => {
            const isPlaying = currentTrackId === track.id;

            return (
              <tr
                key={track.id}
                className={`track-list-row ${isPlaying ? "playing" : ""}`}
                onClick={() => onTrackClick(track)}
              >
                <td className="track-number">
                  {isPlaying ? (
                    <div className="playing-icon">
                      <div className="playing-bar" style={{ height: "6px" }} />
                      <div className="playing-bar" style={{ height: "12px" }} />
                      <div className="playing-bar" style={{ height: "8px" }} />
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  <svg
                    className="track-play-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </td>
                <td className="track-title-cell">
                  <div className="track-title">{track.title}</div>
                </td>
                <td>
                  <div className="track-artist">{track.artist}</div>
                </td>
                <td>
                  <div className="track-duration">{track.duration}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
