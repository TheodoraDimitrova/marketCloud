import React from "react";
import { Button } from "../../ui/button";
import Link from "next/link";

const OurWorldDropdown = () => {
  return (
    <div className="relative flex items-center bg-white h-[50vh] max-h-[60vh] ">
      <div className="w-1/2  p-10 flex flex-col z-20 ">
        <div className="m-9 w-4/5 mx-auto text-center">
          <h1 className="mb-6">Amazing Experience</h1>
          <p className="text-lg">
            Discover how we blend visuals with text to create a seamless and
            engaging design. The transition effect brings harmony between
            sections.
          </p>
          <div className="flex space-x-4 mt-4 justify-center">
            <Button asChild>
              <Link href="/collections/best">Best Sellers</Link>
            </Button>
            <Button asChild>
              <Link href="/collections/new">New arrivals</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f2979c] to-transparent  transition-all duration-700 ease-in-out "></div>

      <div
        className="w-1/2 bg-cover bg-center h-full"
        style={{
          backgroundImage: "url('/images/makeup.png')",
        }}
      ></div>
    </div>
  );
};

export default OurWorldDropdown;
