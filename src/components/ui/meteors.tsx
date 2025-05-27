"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteorCount = number || 10;
  const meteors = new Array(meteorCount).fill(true);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-none absolute inset-0"
    >
      {meteors.map((el, idx) => {
        // 横向分布在卡片宽度中间部分
        const position = idx * (400 / meteorCount) + 40; // 只在卡片宽度中间分布
        const top = Math.random() * 40; // 只在顶部40px内
        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-white/80 shadow-[0_0_0_1px_#ffffff30]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[60px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-white before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: `${top}px`,
              left: position + "px",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.floor(Math.random() * (7 - 4) + 4) + "s",
            }}
          ></span>
        );
      })}
    </motion.div>
  );
}; 