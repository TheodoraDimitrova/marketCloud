"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductReviews from "./ProductReviews";
import { Review } from "@/lib/types/review";

// Extend Window interface to include refresh function
declare global {
  interface Window {
    [key: `refreshReviews_${string}`]: (() => void) | undefined;
  }
}

interface ReviewsSectionProps {
  reviews: Review[];
  productId: string;
}

const ReviewsSection = ({
  reviews: initialReviews,
  productId,
}: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const router = useRouter();

  // Sync with initial reviews if they change (from server)
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // Expose refresh function to parent via window (for ProductDetails to call)
  useEffect(() => {
    const handleRefreshReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        router.refresh();
      }
    };

    // Store refresh function on window for ProductDetails to access
    window[`refreshReviews_${productId}`] = handleRefreshReviews;

    return () => {
      delete window[`refreshReviews_${productId}`];
    };
  }, [productId, router]);

  return (
    <section className="container mx-auto px-2 md:px-6 mt-4 md:mt-6">
      <ProductReviews reviews={reviews} />
    </section>
  );
};

export default ReviewsSection;
