import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  {
    src: '/image/ningning.jpg',
    alt: 'Ningning Portrait'
  },
  {
    src: '/image/ningning1.jpg',
    alt: 'Ningning Style 1'
  },
  {
    src: '/image/ningning2.jpg',
    alt: 'Ningning Style 2'
  },
  {
    src: '/image/ningning3.jpg',
    alt: 'Ningning Style 3'
  },
  {
    src: '/image/ningning4.jpg',
    alt: 'Ningning Style 4'
  }
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-100">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-1000 ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            quality={95}
          />
        </div>
      ))}
      
      <button
        onClick={handlePrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 