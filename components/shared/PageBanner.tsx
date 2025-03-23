import React from "react";

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  const textColor = backgroundImage ? "text-white" : "text-black";
  const containerHeight = backgroundImage ? "h-64" : "h-16";

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full ${containerHeight} text-white text-center p-5 ${
        backgroundImage ? "bg-cover bg-center" : "bg-white"
      }`}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}

      <div className={`relative z-10 ${textColor}`}>
        <h1>{title}</h1>
        {subtitle && <p className="text-lg md:text-xl mt-2">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Banner;
