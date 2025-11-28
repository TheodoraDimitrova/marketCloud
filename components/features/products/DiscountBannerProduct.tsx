"use client";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { useState, useEffect } from "react";

interface Discount {
  isActive: boolean;
  type: string;
  amount: number;
}

interface DiscountBannerProductProps {
  price: number;
  discount?: Discount;
}

const DiscountBannerProduct: React.FC<DiscountBannerProductProps> = ({
  price,
  discount,
}) => {
  const [discountedPrice, setDiscountedPrice] = useState(price);

  useEffect(() => {
    if (!discount || !discount.isActive) {
      setDiscountedPrice(price);
      return;
    }

    if (discount.type === "percentage") {
      setDiscountedPrice(price - (price * discount.amount) / 100);
    } else if (discount.type === "fixed") {
      setDiscountedPrice(Math.max(price - discount.amount, 0));
    }
  }, [price, discount]);

  return (
    <div className="bg-[#ffedf6] p-4 rounded-sm w-full">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-[#dc0069]">
          <PriceDisplay price={discountedPrice} />
        </span>
        {discount && (
          <span className="text-sm px-2 py-1 rounded">
            -{discount.amount}
            {discount.type === "percentage" ? "%" : "€"} OFF
          </span>
        )}
      </div>

      {discount && (
        <p className="text-gray-500 text-sm line-through">
          <PriceDisplay price={price} />
        </p>
      )}

      {discount && (
        <div className="flex items-center text-xs text-gray-600 mt-2">
          Current price with discount:
          <span className="font text-gray-800 ml-1">
            <PriceDisplay price={price} /> - {discount.amount}
            {discount.type === "percentage" ? "%" : "€"} OFF
          </span>
        </div>
      )}
    </div>
  );
};

export default DiscountBannerProduct;
