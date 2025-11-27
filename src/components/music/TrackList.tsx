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
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {showHeader && (
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-subdued)] text-sm uppercase tracking-wider">
              <th className="px-4 py-3 font-medium w-12 text-center">#</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium text-right">Duration</th>
            </tr>
          </thead>
        )}
        <tbody>
          {tracks.map((track, index) => {
            const isPlaying = currentTrackId === track.id;

            return (
              <tr
                key={track.id}
                className={`group hover:bg-[var(--bg-elevated-highlight)] transition-colors cursor-pointer rounded-md ${isPlaying ? "bg-[var(--bg-elevated-highlight)]" : ""}`}
                onClick={() => onTrackClick(track)}
              >
                <td className="px-4 py-3 text-center text-[var(--text-subdued)] w-12 relative group-hover:text-[var(--text-base)]">
                  {isPlaying ? (
                    <div className="flex items-end justify-center gap-[2px] h-4 w-4 mx-auto">
                      <div className="w-[3px] bg-[var(--spotify-green)] animate-[bounce_1s_infinite] h-2" />
                      <div className="w-[3px] bg-[var(--spotify-green)] animate-[bounce_1.2s_infinite] h-3" />
                      <div className="w-[3px] bg-[var(--spotify-green)] animate-[bounce_0.8s_infinite] h-1" />
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      <svg
                        className="hidden group-hover:block w-4 h-4 mx-auto text-[var(--text-base)]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`font-medium ${isPlaying ? "text-[var(--spotify-green)]" : "text-[var(--text-base)]"}`}
                  >
                    {track.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[var(--text-subdued)] group-hover:text-[var(--text-base)] transition-colors">
                    {track.artist}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-[var(--text-subdued)] font-mono text-xs">
                    {track.duration}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
