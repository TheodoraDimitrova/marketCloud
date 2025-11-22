"use client";

import { useMemo } from "react";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Product } from "@/types/product";

interface FilterBrandsProps {
  onChange: (brands: string[]) => void;
  selectedBrands: string[];
  products?: Product[];
}

const FilterBrands: React.FC<FilterBrandsProps> = ({
  onChange,
  selectedBrands,
  products = [],
}) => {
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((product) => {
      if (product.brand && product.brand.trim()) {
        brandsSet.add(product.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    onChange(newBrands);
  };

  if (availableBrands.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No brands available for this category.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {availableBrands.map((brand) => (
        <div key={brand} className="flex items-center">
          <Checkbox
            id={`item-${brand}`}
            checked={selectedBrands.includes(brand)}
            onCheckedChange={() => toggleBrand(brand)}
          />
          <label htmlFor={`item-${brand}`} className="ml-2">
            {brand}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterBrands;
