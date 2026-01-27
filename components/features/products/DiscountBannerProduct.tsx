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

const DiscountBannerProduct = ({
  price,
  discount,
}: DiscountBannerProductProps) => {
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
    <div className="w-full">
      <div className="flex flex-col">
        <PriceDisplay price={discountedPrice} />
        {discount && (
          <p className="text-sm text-gray-400 line-through mt-0.5">
            € {price.toFixed(2)}
          </p>
        )}
        {discount && (
          <span className="inline-block text-xs font-medium text-brand mt-1">
            Save {discount.amount}
            {discount.type === "percentage" ? "%" : "€"}
          </span>
        )}
      </div>
    </div>
  );
};

export default DiscountBannerProduct;
