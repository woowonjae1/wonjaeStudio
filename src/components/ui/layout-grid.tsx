"use client";
import React from "react";
import Image from "next/image";

interface Card {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
}

export const LayoutGrid = ({
  cards,
}: {
  cards: Card[];
}) => {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.id} className={card.className}>
          <div className="relative overflow-hidden rounded-xl border border-white/[0.2] h-full">
            <Image
              src={card.thumbnail}
              alt={`Banner image ${card.id}`}
              height={1000}
              width={1000}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-end p-8">
              {card.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


