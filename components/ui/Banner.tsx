import React from "react";
import Image from "next/image";

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export const Banner = ({ title, subtitle, backgroundImage }: BannerProps) => {
  return (
    <div className="relative flex-center flex-col w-full h-64 text-white text-center p-5 overflow-hidden">
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={85}
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
