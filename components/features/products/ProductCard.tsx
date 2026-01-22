"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import { Product } from "@/lib/types/product";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { useProductCart } from "@/hooks/useProductCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const { isLoading, handleAddToCart } = useProductCart(product);
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
      <Link
        href={`/product/${product.slug.current}`}
        className="relative w-full"
      >
        <div className="relative w-full aspect-[5/7]">
          <Image
            src={
              hovered
                ? product.images[1]
                  ? urlFor(product.images[1], { quality: 85, format: "webp" })
                  : urlFor(product.images[0], { quality: 85, format: "webp" })
                : urlFor(product.images[0], { quality: 85, format: "webp" })
            }
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              {product.tags.map((tag) => {
                // Luxury color palette matching Tag component
                const getTagColor = (type: string) => {
                  switch (type) {
                    case "discount":
                      return "bg-[#7d0d23] text-white";
                    case "new":
                      return "bg-[#C9A9A6] text-[#1F2933]";
                    case "limited":
                      return "bg-[#D4AF8E] text-[#1F2933]";
                    default:
                      return "bg-gray-400 text-white";
                  }
                };
                return (
                  <p
                    key={tag._key}
                    className={`${getTagColor(tag.type)} text-xs font-medium px-2.5 py-1 rounded`}
                  >
                    {tag.label}
                  </p>
                );
              })}
            </div>
          )}

          {/* Wishlist/Favorite Button */}
          <button
            onClick={onToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg z-20"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                inWishlist
                  ? "fill-[#7d0d23] text-[#7d0d23]"
                  : "text-gray-600 hover:text-[#7d0d23]"
              }`}
            />
          </button>

          {/* Quick Add to Cart - Appears on Hover */}
          <button
            onClick={onAddToCart}
            disabled={isLoading}
            className={`absolute bottom-0 left-0 right-0 bg-black text-white py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
            aria-label="Add to cart"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium text-sm">Adding...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium text-sm">Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Price Details */}
        <div className="flex-between flex-col flex-grow text-center p-3">
          <p className="text-gray-800 text-sm uppercase ">{product.name}</p>
          <PriceDisplay
            price={product.price}
            className="text-sm font-semibold text-gray-600"
          />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
