"use client";
import React, { useState } from "react";
import Image from "next/image";

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const Banner = ({ title, subtitle, backgroundImage }: BannerProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative flex-center flex-col w-full h-64 text-white text-center p-5 overflow-hidden bg-gray-200">
      {backgroundImage && (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse" />
          )}

          <Image
            src={backgroundImage}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
            priority
            quality={85}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </>
      )}

      <div className="relative z-10 text-white">
        <h1>{title}</h1>
        {subtitle && <p className="text-lg md:text-xl mt-2">{subtitle}</p>}
      </div>
    </div>
  );
};
