import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  tags: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="flex flex-col w-full max-w-[250px] bg-white shadow-md rounded-lg overflow-hidden">
      <Link href={`/product/${product.name}`} className="relative">
        {/* Image */}
        <div className="relative w-[250px] h-[350px]">
          <Image
            src={product.image}
            alt="shop_location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 text-center">
            {product.tags.map((tag, index) => (
              <p
                key={index}
                className="bg-red-400 text-xs text-white px-2 py-1 rounded-sm"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>

        {/* Price Details */}
        <div className="flex flex-col items-center justify-between flex-grow text-center p-3">
          <p className="text-gray-800 text-lg font-semibold">{product.name}</p>
          <p className="text-gray-600 text-md"> € {product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
