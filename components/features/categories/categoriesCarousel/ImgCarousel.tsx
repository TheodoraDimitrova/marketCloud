import Link from "next/link";
import React from "react";
import Image from "next/image";

interface ImgCarouselProps {
  totalProducts: number;
  title: string;
  url: string;
  src: string;
}

const ImgCarousel = ({ totalProducts, title, url, src }: ImgCarouselProps) => {
  return (
    <div className="relative">
      <Link href={url}>
        <Image
          alt={title}
          src={src}
          width={200}
          height={250}
          style={{ width: "100%", height: "auto" }}
          sizes="(max-width: 768px) 50vw, (min-width: 1600px) 350px, 50vw"
          className="rounded-[10px] shadow-lg h-[350px]"
        />

        <div className="absolute bottom-2 left-5">
          <p className="text-white text-md uppercase lg:text-xl ">{title}</p>
          <span className="text-sm text-white">{totalProducts} products</span>
        </div>
      </Link>
    </div>
  );
};

export default ImgCarousel;
