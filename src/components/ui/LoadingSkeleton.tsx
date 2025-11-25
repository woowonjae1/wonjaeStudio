"use client";

import React from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "circle" | "album";
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (variant) {
      case "album":
        return (
          <div className={`space-y-3 ${className}`}>
            <div className="bg-gray-700 rounded-lg h-64 w-full animate-pulse" />
            <div className="bg-gray-700 h-4 rounded w-3/4 animate-pulse" />
            <div className="bg-gray-700 h-3 rounded w-1/2 animate-pulse" />
          </div>
        );

      case "card":
        return (
          <div
            className={`bg-gray-700 rounded-lg h-48 animate-pulse ${className}`}
          />
        );

      case "text":
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="bg-gray-700 h-4 rounded w-full animate-pulse" />
            <div className="bg-gray-700 h-4 rounded w-5/6 animate-pulse" />
            <div className="bg-gray-700 h-4 rounded w-4/6 animate-pulse" />
          </div>
        );

      case "circle":
        return (
          <div
            className={`bg-gray-700 rounded-full h-12 w-12 animate-pulse ${className}`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
