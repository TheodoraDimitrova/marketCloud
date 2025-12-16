"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import { Product } from "@/lib/types/product";
import PriceDisplay from "@/components/shared/common/PriceDisplay";

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col w-full h-full max-h-[450px] max-w-[250px] bg-white shadow-md rounded-lg overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug.current}`} className="relative">
        <div className="relative w-[250px] h-[350px]">
          <Image
            src={
              hovered
                ? product.images[1]
                  ? urlFor(product.images[1])
                  : urlFor(product.images[0])
                : urlFor(product.images[0])
            }
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-1 text-center">
              {product.tags.map((tag) => (
                <p
                  key={tag._key}
                  className="bg-red-400 text-xs text-white px-2 py-1 rounded-sm"
                >
                  {tag.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Price Details */}
        <div className="flex-between flex-col flex-grow text-center p-3">
          <p className="text-gray-800 text-sm uppercase ">{product.name}</p>
          <p className="text-gray-600 text-md">
            <PriceDisplay price={product.price} />
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
