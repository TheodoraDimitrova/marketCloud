"use client";

import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/features/products/ProductCard";
import { Banner } from "@/components/ui/Banner";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  return (
    <>
      <Banner
        title="My Wishlist"
        backgroundImage="/images/bg4.png"
        subtitle="Your favorite products saved for later"
      />

      <div className="container mx-auto px-4 py-12">
        {wishlistItems.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-medium mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Save your favorite products by clicking the heart icon on any
              product card. They'll appear here for easy access later!
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          // Products Grid
          <>
            <div className="mb-8">
              <h2 className="text-xl font-medium">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "Product" : "Products"} Saved
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {wishlistItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
