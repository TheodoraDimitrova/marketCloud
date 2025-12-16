"use client";
import React, { useState, useEffect } from "react";
import PriceDisplay from "@/components/shared/common/PriceDisplay";

interface FilterPriceProps {
  onChange: (priceRange: [number, number]) => void;
  priceRange: [number, number] | [];
}

const FilterPrice = ({ onChange, priceRange }: FilterPriceProps) => {
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(150);

  useEffect(() => {
    if (priceRange && priceRange.length === 0) {
      setMinPrice(1);
      setMaxPrice(150);
    } else {
      setMinPrice(priceRange[0]);
      setMaxPrice(priceRange[1]);
    }
  }, [priceRange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
  ) => {
    let value = Number(e.target.value);

    if (value < 1) value = 1;
    if (value > 150) value = 150;

    if (isMin) {
      if (value > maxPrice) value = maxPrice;
      setMinPrice(value);
      onChange([value, maxPrice]);
    } else {
      if (value < minPrice) value = minPrice;
      setMaxPrice(value);
      onChange([minPrice, value]);
    }
  };

  return (
    <div className="relative mt-4">
      <div className="flex items-center justify-around gap-2 mb-4">
        <input
          type="number"
          className="border rounded w-16 p-1  pl-2 text-gray-700"
          min="1"
          max="150"
          value={minPrice}
          onChange={(e) => handleChange(e, true)}
        />
        <span>-</span>
        <input
          type="number"
          className="border rounded w-16 p-1 pl-2 text-gray-700"
          min="1"
          max="150"
          value={maxPrice}
          onChange={(e) => handleChange(e, false)}
        />
      </div>

      <div className="relative w-full">
        <input
          type="range"
          min="1"
          max="150"
          value={minPrice}
          onChange={(e) => handleChange(e, true)}
          className="w-full h-1 bg-gray-300"
        />
        <input
          type="range"
          min="1"
          max="150"
          value={maxPrice}
          onChange={(e) => handleChange(e, false)}
          className="w-full h-1 bg-gray-300"
        />
      </div>

      <div className="flex justify-between text-sm mt-2">
        <span>
          <PriceDisplay price={minPrice} />
        </span>
        <span>
          <PriceDisplay price={maxPrice} />
        </span>
      </div>
    </div>
  );
};

export default FilterPrice;
