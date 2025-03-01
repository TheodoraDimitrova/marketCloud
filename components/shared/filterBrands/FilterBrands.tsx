"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBrandsProps {
  onChange: (brands: string[]) => void;
  selectedBrands: string[];
}
const brands = [
  "L'Oréal",
  "Maybelline",
  "MAC Cosmetics",
  "Fenty Beauty",
  "Clinique",
];

const FilterBrands: React.FC<FilterBrandsProps> = ({
  onChange,
  selectedBrands,
}) => {
  // useEffect(() => {
  //   console.log(selectedBrands);
  // }, [selectedBrands]);

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    onChange(newBrands);
  };

  return (
    <div className="flex flex-col gap-2">
      {brands.map((brand) => (
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
