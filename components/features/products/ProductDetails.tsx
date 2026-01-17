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
import { Heart, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumb from "@/components/shared/common/Breadcrumb";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import ReviewForm from "./ReviewForm";

// Extend Window interface to include refresh function
declare global {
  interface Window {
    [key: `refreshReviews_${string}`]: (() => void) | undefined;
  }
}

interface ProductDetailsProps {
  product: Product;
  primaryImageUrl: string;
  secondaryImageUrl: string;
  productId: string;
  reviewsCount?: number;
  onReviewSubmit?: () => void;
}

const ProductDetails = ({
  product,
  primaryImageUrl,
  secondaryImageUrl,
  productId,
  reviewsCount = 0,
  onReviewSubmit,
}: ProductDetailsProps) => {
  const [hovered, setHovered] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleReviewSubmit = () => {
    // Call the refresh function stored on window by ReviewsSection
    if (typeof window !== "undefined") {
      const refreshFn = window[`refreshReviews_${productId}`];
      if (refreshFn) {
        refreshFn();
      }
    }
    if (onReviewSubmit) {
      onReviewSubmit();
    }
  };
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
      } catch {
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

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(product.category?.name && product.category?.slug?.current
      ? [
          {
            label: product.category.name,
            href: `/category/${product.category.slug.current}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <section className="container mx-auto p-2 md:p-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="flex flex-col justify-start max-w-md p-2 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-600 m-0 flex-1">
              {product.name}
            </h1>
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
                      ? "fill-[#7d0d23] text-[#7d0d23]"
                      : "text-gray-600 hover:text-[#7d0d23]"
                  }`}
                />
              </button>
            </div>
          </div>
          {product.brand && (
            <p className="text-base font-medium text-gray-600 mt-1 mb-2">
              Brand: {product.brand}
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3">
            {product.tags && product.tags.length > 0 && (
              <div className="flex-1">
                <ListTags tags={product.tags} />
              </div>
            )}
            {product.rating && product.rating > 0 ? (
              <div className="md:ml-auto">
                <Rating rating={product.rating} />
              </div>
            ) : null}
          </div>

          {product.discount?.isActive ? (
            <div className="my-3">
              <DiscountBannerProduct
                price={product.price}
                discount={product.discount}
              />
            </div>
          ) : (
            <div className="flex justify-end items-center my-3">
              <PriceDisplay price={product.price} />
            </div>
          )}

          <div className="mt-4 flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              updateQuantity={handleUpdateQuantity}
            />
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            {/* Description Accordion */}
            <div className="border-b border-gray-200">
              <details className="group" open>
                <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                  Description
                  <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                  <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                </summary>
                <div className="pb-4 pt-2 text-gray-700">
                  <p className="text-base text-justify leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </details>
            </div>

            {/* Product Details Accordion */}
            <div className="border-b border-gray-200">
              <details className="group">
                <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                  Product Details
                  <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                  <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                </summary>
                <div className="pb-4 pt-2 text-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    {product.productDetails.map((detail, index) => (
                      <li
                        key={index}
                        className="text-justify text-base leading-relaxed"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>

            {/* Sizes Information */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="border-b border-gray-200">
                <details className="group">
                  <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                    Sizes
                    <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                    <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                      <ChevronUp className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="pb-4 pt-2 text-gray-700">
                    <p className="text-base text-justify leading-relaxed">
                      {product.sizes.join(", ")}
                    </p>
                  </div>
                </details>
              </div>
            )}

            {/* Package Information */}
            {product.package && (
              <div className="border-b border-gray-200">
                <details className="group">
                  <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                    Package
                    <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                    <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                      <ChevronUp className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="pb-4 pt-2 text-gray-700">
                    <p className="text-base text-justify leading-relaxed">
                      {product.package}
                    </p>
                  </div>
                </details>
              </div>
            )}

            {/* Placeholder for future sections - Ingredients */}
            {/* Uncomment when ingredients data is available
          <div className="border-b border-gray-200">
            <details className="group">
              <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-700 py-4 hover:text-gray-900 transition-colors">
                Ingredients
                <span className="text-xl font-bold transition-all text-gray-500 duration-300 group-open:hidden">
                  <ChevronDown className="w-5 h-5" />
                </span>
                <span className="text-xl font-bold transition-all text-gray-500 duration-300 hidden group-open:block">
                  <ChevronUp className="w-5 h-5" />
                </span>
              </summary>
              <div className="pb-4 text-gray-700">
                <p className="text-justify">{product.ingredients || "Ingredients information coming soon."}</p>
              </div>
            </details>
          </div>
          */}

            {/* Placeholder for future sections - Usage Instructions */}
            {/* Uncomment when usage instructions data is available
          <div className="border-b border-gray-200">
            <details className="group">
              <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-700 py-4 hover:text-gray-900 transition-colors">
                Usage Instructions
                <span className="text-xl font-bold transition-all text-gray-500 duration-300 group-open:hidden">
                  <ChevronDown className="w-5 h-5" />
                </span>
                <span className="text-xl font-bold transition-all text-gray-500 duration-300 hidden group-open:block">
                  <ChevronUp className="w-5 h-5" />
                </span>
              </summary>
              <div className="pb-4 text-gray-700">
                <p className="text-justify">{product.usageInstructions || "Usage instructions coming soon."}</p>
              </div>
            </details>
          </div>
          */}

            {/* Shipping Information */}
            <div className="border-b border-gray-200">
              <details className="group">
                <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                  Shipping Information
                  <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                  <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                </summary>
                <div className="pb-4 pt-2 text-gray-700 space-y-4">
                  <div>
                    <p className="font-semibold mb-2 text-gray-800">
                      Delivery Methods:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-base">
                      <li className="text-justify">
                        Delivery to Address: €5.99
                      </li>
                      <li className="text-justify">
                        Delivery to Courier Office: €3.99
                      </li>
                      <li className="text-justify">
                        Delivery to Smart Point: €2.99
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-800">
                      Free Shipping:
                    </p>
                    <p className="text-base text-justify leading-relaxed">
                      Enjoy free shipping on all orders over €
                      {FREE_SHIPPING_THRESHOLD}. Orders are typically processed
                      within 1-2 business days and delivered within 3-5 business
                      days.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-800">
                      Delivery Areas:
                    </p>
                    <p className="text-base text-justify leading-relaxed">
                      We currently deliver to Greece and Bulgaria. For
                      international shipping, please contact us for more
                      information.
                    </p>
                  </div>
                </div>
              </details>
            </div>

            {/* Write a Review Accordion */}
            <div className="border-b border-gray-200">
              <details className="group">
                <summary className="flex-between cursor-pointer text-lg font-semibold text-gray-600 py-3 hover:text-gray-700 transition-colors">
                  Write a Review
                  {reviewsCount > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({reviewsCount}{" "}
                      {reviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  )}
                  <span className="text-gray-400 transition-all duration-300 group-open:hidden">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                  <span className="text-gray-400 transition-all duration-300 hidden group-open:block">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                </summary>
                <div className="pb-4 pt-2">
                  <ReviewForm
                    productId={productId}
                    onSubmitSuccess={handleReviewSubmit}
                  />
                </div>
              </details>
            </div>

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
    </section>
  );
};

export default ProductDetails;
