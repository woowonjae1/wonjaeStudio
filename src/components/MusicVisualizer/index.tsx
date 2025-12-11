"use client";

import { useEffect, useState } from "react";
import "./MusicVisualizer.css";

interface MusicVisualizerProps {
  className?: string;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

export default function MusicVisualizer({
  className = "",
  size = "medium",
  animated = true,
}: MusicVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!animated) return;

    const generateBars = () => {
      const newBars = Array.from({ length: 5 }, () => Math.random() * 100 + 20);
      setBars(newBars);
    };

    generateBars();
    const interval = setInterval(generateBars, 300);

    return () => clearInterval(interval);
  }, [animated]);

  return (
    <div className={`music-visualizer ${size} ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="visualizer-bar"
          style={{
            height: animated ? `${bars[index] || 50}%` : "50%",
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
