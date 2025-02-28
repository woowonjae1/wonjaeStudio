"use client";

// Add Props interface
interface RetroGridProps {
  role?: string;
}

// Update component to accept props
const RetroGrid = ({ role }: RetroGridProps) => <div role={role}>This is a placeholder for RetroGrid component.</div>;

export function RetroGridDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      {/* Add aria-label for accessibility */}
      <h1 
        className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent"
        aria-label="Retro Grid"
      >
        Retro Grid
      </h1>

      {/* Add role="presentation" since this is decorative */}
      <RetroGrid role="presentation" />
    </div>
  );
}