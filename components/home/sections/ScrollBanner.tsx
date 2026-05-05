"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ScrollBanner = () => {
  const imageArray = [
    {
      src: "/images/Maybelline-Logo.png",
      alt: "Maybelline",
      width: 210,
      height: 100,
    },
    { src: "/images/mac.png", alt: "MAC", width: 210, height: 100 },
    { src: "/images/loreal.png", alt: "L'Oréal", width: 170, height: 100 },
    { src: "/images/Lancome.png", alt: "Lancôme", width: 250, height: 100 },
  ];

  // Repeat more times so the row stays filled on large viewports.
  const extendedArray = [...imageArray, ...imageArray, ...imageArray, ...imageArray];

  return (
    <div className="overflow-hidden bg-white py-6 sm:py-8 md:py-10 lg:py-12">
      <motion.div
        className="flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12"
        animate={{ x: ["0%", "-25%"] }}
        initial={{ x: "0%" }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 24,
            ease: "linear",
          },
        }}
      >
        {extendedArray.map((image, index) => (
          <div
            key={`${image.alt}-${index}`}
            className="flex h-10 w-24 flex-shrink-0 items-center justify-center sm:h-12 sm:w-28 md:h-14 md:w-32 lg:h-16 lg:w-40"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollBanner;
