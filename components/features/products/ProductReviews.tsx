"use client";

import { Review } from "@/lib/types/review";
import { FaStar, FaRegStar } from "react-icons/fa";

interface ProductReviewsProps {
  reviews: Review[];
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array(5)
          .fill(0)
          .map((_, index) => {
            if (index < rating) {
              return (
                <FaStar
                  key={index}
                  className="w-4 h-4 text-[#7d0d23] fill-[#7d0d23]"
                />
              );
            }
            return (
              <FaRegStar
                key={index}
                className="w-4 h-4 text-gray-300 fill-current"
              />
            );
          })}
      </div>
    );
  };

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 pt-4">
      <h2 className="text-2xl font-semibold mb-3">
        Customer Reviews ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-gray-100 pb-6 last:border-b-0"
          >
            <div className="mb-3">
              <p className="text-base font-semibold text-gray-900 mb-2">
                {review.author}
              </p>
              <div className="mb-2">{renderStars(review.rating)}</div>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
