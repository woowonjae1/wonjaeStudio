"use client";

import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="table-skeleton">
      <div className="skeleton-header">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="1rem" width={i === 0 ? "30%" : "15%"} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height="1rem"
              width={colIndex === 0 ? "60%" : "40%"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height="3rem" width="3rem" borderRadius="10px" />
      <div className="card-skeleton-content">
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
    </div>
  );
}
