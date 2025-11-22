import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex my-4">
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`full-${index}`} className="h-4 w-4 text-yellow-500" />
        ))}

      {halfStar === 1 && (
        <FaStarHalfAlt key="half" className="h-4 w-4 text-yellow-500" />
      )}

      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaRegStar
            key={`empty-${index}`}
            className="h-4 w-4 text-yellow-500"
          />
        ))}
    </div>
  );
};

export default Rating;
