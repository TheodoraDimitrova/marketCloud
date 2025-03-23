import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ElementType } from "react";

interface SectionRichTextProps {
  icon?: ElementType;
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
}

const SectionRichText: React.FC<SectionRichTextProps> = ({
  icon: Icon,
  title,
  text,
  buttonText,
  buttonLink,
  bgColor = "bg-slate-300",
}) => {
  return (
    <section className={`${bgColor} py-6 lg:py-12 px-4 `}>
      <div className="flex flex-col justify-center items-center max-w-3xl  mx-auto">
        {Icon && <Icon size={40} className="mb-2" />}
        <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 ">
          {title}
        </h2>
        <p className="text-center">{text}</p>

        {buttonText && buttonLink && (
          <Button asChild className="w-60 mt-4">
            <Link href={buttonLink} className="uppercase">
              {buttonText}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default SectionRichText;
