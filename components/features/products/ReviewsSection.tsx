"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";
import { Review } from "@/lib/types/review";

interface ReviewsSectionProps {
  reviews: Review[];
  productId: string;
}

const ReviewsSection = ({ reviews: initialReviews, productId }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const router = useRouter();

  const handleReviewSubmit = async () => {
    // Fetch latest reviews after successful submit
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback: refresh the page
      router.refresh();
    }
  };

  // Sync with initial reviews if they change (from server)
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  return (
    <div className="container mx-auto px-4">
      <ProductReviews reviews={reviews} />
      <ReviewForm productId={productId} onSubmitSuccess={handleReviewSubmit} />
    </div>
  );
};

export default ReviewsSection;
