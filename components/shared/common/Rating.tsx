import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
interface RatingProps {
  rating: number;
}

const Rating = ({ rating }: RatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex gap-0.5">
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`full-${index}`} className="h-4 w-4 text-brand fill-brand" />
        ))}

      {halfStar === 1 && (
        <FaStarHalfAlt key="half" className="h-4 w-4 text-brand fill-brand" />
      )}

      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaRegStar
            key={`empty-${index}`}
            className="h-4 w-4 text-gray-300"
          />
        ))}
    </div>
  );
};

export default Rating;
