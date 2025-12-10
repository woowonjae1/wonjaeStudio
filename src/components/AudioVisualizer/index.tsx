"use client";

import { useEffect, useRef, useState } from "react";
import "./AudioVisualizer.css";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  color?: string;
}

// Shared audio context to avoid creating multiple instances
let sharedAudioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
let sharedSource: MediaElementAudioSourceNode | null = null;

const AudioVisualizer = ({
  audioElement,
  isPlaying,
  color = "rgba(255, 255, 255, 0.9)",
}: AudioVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(new Array(20).fill(10));
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    try {
      // Create or reuse audio context
      if (!sharedAudioContext) {
        sharedAudioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Create analyser if not exists
      if (!sharedAnalyser) {
        sharedAnalyser = sharedAudioContext.createAnalyser();
        sharedAnalyser.fftSize = 128; // Increased for better resolution
        sharedAnalyser.smoothingTimeConstant = 0.8; // Smooth transitions
      }

      // Create source if not exists or if audio element changed
      if (!sharedSource) {
        sharedSource =
          sharedAudioContext.createMediaElementSource(audioElement);
        sharedSource.connect(sharedAnalyser);
        sharedAnalyser.connect(sharedAudioContext.destination);
      }

      const bufferLength = sharedAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateBars = (timestamp: number) => {
        // Throttle updates to 30fps for better performance
        if (timestamp - lastUpdateRef.current < 33) {
          animationFrameRef.current = requestAnimationFrame(updateBars);
          return;
        }
        lastUpdateRef.current = timestamp;

        if (!sharedAnalyser) return;

        sharedAnalyser.getByteFrequencyData(dataArray as any);

        // Sample 20 bars for full width coverage
        const newBars = [];
        const step = Math.floor(bufferLength / 20);

        for (let i = 0; i < 20; i++) {
          const index = i * step;
          const value = dataArray[index];
          // Map 0-255 to 5-100 (percentage)
          const height = Math.max(5, Math.min(100, (value / 255) * 100));
          newBars.push(height);
        }

        setBars(newBars);
        animationFrameRef.current = requestAnimationFrame(updateBars);
      };

      animationFrameRef.current = requestAnimationFrame(updateBars);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } catch (error) {
      console.error("Audio visualizer error:", error);
    }
  }, [audioElement, isPlaying]);

  return (
    <div
      className={`audio-visualizer ${!isPlaying ? "inactive" : ""}`}
      style={{ "--bar-color": color } as React.CSSProperties}
    >
      {bars.map((height, index) => (
        <div
          key={index}
          className="visualizer-bar"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
