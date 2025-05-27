"use client";
import React from "react";
import { motion } from "framer-motion";

// Simple utility function to merge class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Meteors = ({
  number = 20,
  className = "",
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = React.useMemo(() => {
    return Array.from({ length: number }).map((_, idx) => ({
      id: idx,
      position: idx * (400 / number) + 40,
      top: Math.random() * 40,
      delay: Math.random() * 5,
      duration: Math.floor(Math.random() * (7 - 4) + 4)
    }));
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-none absolute inset-0"
    >
      {meteors.map((meteor) => (
        <span
          key={`meteor-${meteor.id}`}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-white/80 shadow-[0_0_0_1px_#ffffff30]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[60px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-white before:to-transparent before:content-['']",
            className,
          )}
          style={{
            top: `${meteor.top}px`,
            left: meteor.position + "px",
            animationDelay: meteor.delay + "s",
            animationDuration: meteor.duration + "s",
          }}
        ></span>
      ))}
    </motion.div>
  );
}; 