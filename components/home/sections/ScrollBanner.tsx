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

  const extendedArray = [...imageArray, ...imageArray, ...imageArray];

  return (
    <div className="block overflow-hidden py-8 bg-white  ">
      <motion.div
        className="flex space-x-[120px] items-center"
        animate={{ x: ["0%", "-100%"] }}
        initial={{ x: "0%" }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 22,
            ease: "linear",
          },
        }}
        style={{ width: "100%" }}
      >
        {extendedArray.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 "
            style={{ flexBasis: "auto" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className=" object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollBanner;
