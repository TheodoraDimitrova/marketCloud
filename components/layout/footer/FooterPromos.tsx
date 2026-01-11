import React from "react";
import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const FooterPromos = () => {
  return (
    <div className="bg-[#FAF8F6] py-5 px-2 md:px-20">
      <div className="container mx-auto flex flex-wrap justify-between opacity-90">
        <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center ">
          <div className="flex flex-col items-center text-[#333]">
            <Truck className="w-6 h-6" />
            <div className="text-center">
              <h6 className="mt-1">Free shipping</h6>
            </div>
          </div>
        </div>
        <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center">
          <div className="flex flex-col items-center text-[#333]">
            <RotateCcw className="w-6 h-6" />
            <div className="text-center">
              <h6 className="mt-1">Easy returns</h6>
            </div>
          </div>
        </div>
        <div className="w-1/2  md:w-1/4  flex flex-col items-center">
          <div className="flex flex-col items-center text-[#333]">
            <ShieldCheck className="w-6 h-6" />
            <div className="text-center">
              <h6 className="mt-1">Secure checkout</h6>
            </div>
          </div>
        </div>
        <div className="w-1/2  md:w-1/4  flex flex-col items-center">
          <div className="flex flex-col items-center text-[#333]">
            <Star className="w-6 h-6 fill-current" />
            <div className="text-center">
              <h6 className="mt-1">5.0 star rating</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterPromos;
