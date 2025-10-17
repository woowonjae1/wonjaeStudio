"use client";

import React from "react";

interface ShineBorderProps {
  shineColor?: string;
  className?: string;
}

export function ShineBorder({ shineColor = "white" }: ShineBorderProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-lg"
      style={{
        background: `linear-gradient(90deg, transparent, ${shineColor}, transparent)`,
        backgroundSize: '200% 100%',
        animation: 'shine 3s linear infinite',
        opacity: 0.1,
      }}
    />
  );
}

