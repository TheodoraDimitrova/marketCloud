"use client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import QuantitySelector from "@/components/shared/common/QuantitySelector";
import { useState } from "react";
import ListTags from "@/components/shared/tags/ListTags";
import Rating from "@/components/shared/common/Rating";
import DiscountBannerProduct from "@/components/features/products/DiscountBannerProduct";
import { useProductCart } from "@/hooks/useProductCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@/lib/types/product";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { Heart, Copy, Check } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  primaryImageUrl: string;
  secondaryImageUrl: string;
}

const ProductDetails = ({
  product,
  primaryImageUrl,
  secondaryImageUrl,
}: ProductDetailsProps) => {
  const [hovered, setHovered] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { quantity, handleUpdateQuantity, handleAddToCart } =
    useProductCart(product);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id);

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product.slug.current}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: productUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(productUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* left side */}
      <div className="flex justify-center place-items-start p-4 md:p-0">
        <Image
          src={hovered ? secondaryImageUrl : primaryImageUrl}
          alt={product.name}
          width={200}
          height={250}
          style={{ width: "auto", height: "auto" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-[10px] shadow-lg h-[350px]"
          priority
          quality={85}
          unoptimized={true}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>

      {/* right side */}
      <div className="flex flex-col justify-start max-w-md p-2 md:p-6 ">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h1 className="text-xl m-0 flex-1">{product.name}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleToggleWishlist}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  inWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700 hover:text-red-500"
                }`}
              />
            </button>
          </div>
        </div>
        {product.brand && (
          <p className="text-sm font-medium text-gray-600 mt-1">
            Brand: {product.brand}
          </p>
        )}
        <p className="text-sm font-light uppercase">{product.description}</p>

        {product.rating && <Rating rating={product.rating} />}
        {product.tags && product.tags.length > 0 && (
          <ListTags tags={product.tags} />
        )}

        <div className="flex justify-between my-6">
          <p>{product.package || "No package info available"}</p>
          <PriceDisplay price={product.price} />
        </div>

        {product.discount?.isActive && (
          <DiscountBannerProduct
            price={product.price}
            discount={product.discount}
          />
        )}

        <div className="mt-6 flex items-center justify-around">
          <QuantitySelector
            quantity={quantity}
            updateQuantity={handleUpdateQuantity}
          />
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl  text-gray-600">Product Details</h2>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
            {product.productDetails.map((detail, index) => (
              <li key={index} className="text-justify">
                {detail}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Copy product link"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Link copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
