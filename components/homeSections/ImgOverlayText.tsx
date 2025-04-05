import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImgOverlayTextProps {
  subheading: string;
  title: string;
  textBtn: string;
  url: string;
  src: string;
}

const ImgOverlayText: React.FC<ImgOverlayTextProps> = ({
  subheading,
  title,
  textBtn,
  url,
  src,
}) => {
  return (
    <div className="relative ">
      <Image
        alt={title}
        src={src}
        width={200}
        height={250}
        style={{ width: "100%", height: "auto" }}
        sizes="(max-width: 768px) 50vw, (min-width: 1600px) 350px, 50vw"
        className="rounded-[10px] shadow-lg h-[350px]"
        priority
      />

      <div className="absolute w-full h-full  inset-0 bg-black bg-opacity-50 overflow-hidden rounded-xl">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
          <span className="text-sm text-white font-light uppercase bold">
            {subheading}
          </span>
          <h2 className="text-white">{title}</h2>
          <Button asChild variant="link">
            <Link href={url}>{textBtn}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImgOverlayText;
