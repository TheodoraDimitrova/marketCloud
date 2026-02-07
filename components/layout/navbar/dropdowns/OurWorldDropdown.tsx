import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const OurWorldDropdown = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-white h-auto md:h-[50vh] max-h-[60vh] overflow-hidden">
      {/* Text Section */}
      <div className="w-full md:w-1/2 p-4 md:p-10 flex flex-col z-20 text-center order-2 md:order-1">
        <div className="w-full md:w-4/5 mx-auto">
          <h1>Amazing Experience</h1>
          <p className="text-sm md:text-lg mb-4 md:mb-6">
            Discover how we blend visuals with text to create a seamless and
            engaging design. The transition effect brings harmony between
            sections.
          </p>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 justify-center">
            <Button asChild>
              <Link href="/products?discounts=Best+Seller">Best Sellers</Link>
            </Button>
            <Button asChild>
              <Link href="/products?discounts=New+Arrival">New arrivals</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient Overlay - Desktop only */}
      <div className="hidden md:block absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gradient-pink to-transparent transition-all duration-700 ease-in-out z-10"></div>

      {/* Image Section */}
      <div className="relative w-full md:w-1/2 h-48 md:h-full min-h-[200px] md:min-h-0 order-1 md:order-2">
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
