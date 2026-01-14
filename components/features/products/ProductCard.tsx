"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import { Product } from "@/lib/types/product";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { useProductCart } from "@/hooks/useProductCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingBag, Heart } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const { handleAddToCart } = useProductCart(product);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart();
  };

  const onToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <div
      className="flex flex-col w-full h-full max-h-[450px] max-w-[250px] bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
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
            unoptimized={true}
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

          {/* Wishlist/Favorite Button */}
          <button
            onClick={onToggleWishlist}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
            />
          </button>

          {/* Quick Add to Cart - Appears on Hover */}
          <button
            onClick={onAddToCart}
            className={`absolute bottom-0 left-0 right-0 bg-black text-white py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium text-sm">Add to Cart</span>
          </button>
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
