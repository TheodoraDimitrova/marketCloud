import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProductCard = () => {
  return (
    <div className="flex flex-col w-full max-w-[250px] bg-white shadow-md rounded-lg overflow-hidden">
      <Link href="/categories/lipstics" className="relative">
        {/* Image */}
        <div className="relative w-[250px] h-[350px]">
          <Image
            src="/images/products.png"
            alt="shop_location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 text-center">
            <p className="bg-red-400 text-xs text-white px-2 py-1 rounded-sm">
              New Arrival
            </p>
            <p className="bg-fuchsia-600 text-xs text-white px-2 py-1 rounded-sm">
              Exclusive
            </p>
            <p className="bg-red-600 text-xs text-white px-2 py-1 rounded-sm">
              8% off
            </p>
          </div>
        </div>

        {/* Price Details */}
        <div className="flex flex-col items-center justify-between flex-grow text-center p-3">
          <p className="text-gray-800 text-lg font-semibold">
            Adora Red Essence
          </p>
          <p className="text-gray-600 text-md">14.00 €</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
