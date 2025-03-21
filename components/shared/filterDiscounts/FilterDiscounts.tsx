import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
const discounts: string[] = [
  "-10%",
  "-15%",
  "-20%",
  "New Arrival",
  "Best Seller",
  "One Piece",
];

interface FilterDiscountsProps {
  onChange: (discounts: string[]) => void;
  selectedDiscounts: string[];
}

const FilterDiscounts: React.FC<FilterDiscountsProps> = ({
  onChange,
  selectedDiscounts,
}) => {
  const toggleDiscount = (discount: string) => {
    const newDiscounts = selectedDiscounts.includes(discount)
      ? selectedDiscounts.filter((d: string) => d !== discount)
      : [...selectedDiscounts, discount];

    if (newDiscounts !== selectedDiscounts) {
      onChange(newDiscounts);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {discounts.map((discount) => (
        <div key={`item-${discount}`} className="flex items-center">
          <Checkbox
            id={`item-${discount}`}
            checked={selectedDiscounts.includes(discount)}
            onCheckedChange={() => toggleDiscount(discount)}
          />
          <label htmlFor={`item-${discount}`} className="ml-2">
            {discount}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterDiscounts;
