"use client";
import React, { useState } from "react";
import Image from "next/image";

const cards = [
  {
    id: 1,
    content: (<div><p className="font-bold md:text-4xl text-xl text-white">NINGNING</p></div>),
    thumbnail: "/image/banner宁1.jpg",
  },
  {
    id: 2,
    content: (<div><p className="font-bold md:text-4xl text-xl text-white">NINGNING</p></div>),
    thumbnail: "/image/banner宁3.jpg",
  },
  {
    id: 3,
    content: (<div><p className="font-bold md:text-4xl text-xl text-white">NINGNING</p></div>),
    thumbnail: "/image/ningning.jpg",
  },
  {
    id: 4,
    content: (<div><p className="font-bold md:text-4xl text-xl text-white">NINGNING</p></div>),
    thumbnail: "/image/banner宁2.jpg",
  },
];

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex justify-center items-center py-12">
      <div className="grid grid-cols-3 grid-rows-2 gap-6 w-[90vw] max-w-6xl h-[600px] relative">
        {/* 第一行：2张图+1张图 */}
        <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative">
          <div className="w-full h-full cursor-pointer" onClick={() => setActiveIndex(0)}>
            <Image src={cards[0].thumbnail} alt="banner1" fill style={{objectFit:'cover'}} className="rounded-2xl" />
          </div>
        </div>
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative">
          <div className="w-full h-full cursor-pointer" onClick={() => setActiveIndex(1)}>
            <Image src={cards[1].thumbnail} alt="banner2" fill style={{objectFit:'cover'}} className="rounded-2xl" />
          </div>
        </div>
        {/* 第二行：1张图+2张图 */}
        <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative">
          <div className="w-full h-full cursor-pointer" onClick={() => setActiveIndex(2)}>
            <Image src={cards[2].thumbnail} alt="banner3" fill style={{objectFit:'cover'}} className="rounded-2xl" />
          </div>
        </div>
        <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative">
          <div className="w-full h-full cursor-pointer" onClick={() => setActiveIndex(3)}>
            <Image src={cards[3].thumbnail} alt="banner4" fill style={{objectFit:'cover'}} className="rounded-2xl" />
          </div>
        </div>
        {/* 弹窗展示 */}
        {activeIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40" onClick={() => setActiveIndex(null)}>
            <div className="relative rounded-2xl shadow-2xl max-w-xl w-full aspect-square flex items-end overflow-hidden" style={{minHeight:'400px', minWidth:'400px'}} onClick={e => e.stopPropagation()}>
              <Image src={cards[activeIndex].thumbnail} alt="banner-active" fill style={{objectFit:'cover'}} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
              <div className="absolute inset-0 bg-black/40 rounded-2xl" />
              <div className="relative w-full text-center pb-10 z-10">
                <div className="mx-auto w-full flex flex-col items-center justify-center">
                  <span className="text-white font-extrabold text-3xl md:text-4xl drop-shadow-lg">NINGNING</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 