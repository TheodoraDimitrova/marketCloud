import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ElementType } from "react";

interface RichTextProps {
  icon?: ElementType;
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
}

const RichText = ({
  icon: Icon,
  title,
  text,
  buttonText,
  buttonLink,
  bgColor = "bg-slate-300",
}: RichTextProps) => {
  return (
    <section className={`${bgColor} py-6 lg:py-12 px-4 `}>
      <div className="flex-center flex-col max-w-3xl  mx-auto">
        {Icon && <Icon size={40} className="mb-2" />}
        <h2>{title}</h2>
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

export default RichText;
