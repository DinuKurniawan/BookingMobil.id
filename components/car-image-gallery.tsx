"use client";

import { useState } from "react";
import Image from "next/image";

interface CarImageGalleryProps {
  images: string[];
  carName: string;
}

export function CarImageGallery({ images, carName }: CarImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-gray-300">
        <svg
          className="w-16 h-16 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <p className="text-sm font-medium">Belum ada foto</p>
      </div>
    );
  }

  const goTo = (idx: number) => {
    if (idx < 0) setActiveIndex(images.length - 1);
    else if (idx >= images.length) setActiveIndex(0);
    else setActiveIndex(idx);
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image
          key={activeIndex}
          src={images[activeIndex]}
          alt={`${carName} - Foto ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] animate-[fadeIn_0.3s_ease-out]"
          priority={activeIndex === 0}
        />

        {/* Counter badge */}
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </span>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Foto sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Foto berikutnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                idx === activeIndex
                  ? "ring-2 ring-blue-600 ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={src}
                alt={`${carName} thumbnail ${idx + 1}`}
                width={80}
                height={56}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
