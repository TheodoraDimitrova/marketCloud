import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const OurWorldDropdown = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-white h-auto md:h-[50vh] max-h-[60vh]">
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col z-20 text-center">
        <div className="m-6 md:m-9 w-full md:w-4/5 mx-auto">
          <h1>Amazing Experience</h1>
          <p className="text-base md:text-lg">
            Discover how we blend visuals with text to create a seamless and
            engaging design. The transition effect brings harmony between
            sections.
          </p>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-4 justify-center">
            <Button asChild>
              <Link href="/products?discounts=Best+Seller">Best Sellers</Link>
            </Button>
            <Button asChild>
              <Link href="/products?discounts=New+Arrival">New arrivals</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f2979c] to-transparent transition-all duration-700 ease-in-out z-10"></div>

      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <Image
          src="/images/makeup.png"
          alt="Makeup"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          quality={85}
        />
      </div>
    </div>
  );
};

export default OurWorldDropdown;
