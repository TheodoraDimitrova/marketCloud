import React from "react";
import { Truck, Tag, Gift, Star } from "lucide-react";
import Link from "next/link";

const FooterPromos = () => {
  return (
    <div className="bg-[#fcfaf3] text-black py-5 px-2 md:px-20">
      <div className="container mx-auto flex flex-wrap justify-between ">
        <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center ">
          <Link href="/delivery">
            <div className="relative">
              <div className="flex flex-col items-center">
                <Truck />
                <div className="text-center">
                  <h6 className="mt-1">Free shipping</h6>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center">
          <Link href="/delivery">
            <div className="relative">
              <div className="flex flex-col items-center">
                <Tag />
                <div className="text-center">
                  <h6 className="mt-1">New styles</h6>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-1/2  md:w-1/4  flex flex-col items-center">
          <Link href="/delivery">
            <div className="relative">
              <div className="flex flex-col items-center">
                <Gift />
                <div className="text-center">
                  <h6 className="mt-1">Gift Cards</h6>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-1/2  md:w-1/4  flex flex-col items-center">
          <Link href="/delivery">
            <div className="relative">
              <div className="flex flex-col items-center">
                <Star />
                <div className="text-center">
                  <h6 className="mt-1">5.0 star rating</h6>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterPromos;
