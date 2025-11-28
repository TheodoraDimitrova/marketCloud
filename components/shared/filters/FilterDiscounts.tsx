"use client";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Product } from "@/types/product";

const normalizeToUpperCase = (str: string): string => {
  return str.trim().toUpperCase();
};

interface FilterDiscountsProps {
  onChange: (discounts: string[]) => void;
  selectedDiscounts: string[];
  products?: Product[];
}

const FilterDiscounts: React.FC<FilterDiscountsProps> = ({
  onChange,
  selectedDiscounts,
  products = [],
}) => {
  const availableDiscounts = useMemo(() => {
    const discountsSet = new Set<string>();

    products.forEach((product) => {
      if (
        product.discount?.isActive &&
        product.discount?.amount &&
        product.discount
      ) {
        if (product.discount.type === "percentage") {
          // Percentage discount: "-20%"
          const discountLabel = `-${product.discount.amount}%`;
          discountsSet.add(discountLabel);
        } else if (product.discount.type === "fixed") {
          // Fixed discount: "-5€"
          const discountLabel = `-${product.discount.amount}€`;
          discountsSet.add(discountLabel);
        }
      }

      if (product.tags && product.tags.length > 0) {
        product.tags.forEach((tag) => {
          // Show all tags (discount, new, limited, etc.) - not just type === "discount"
          if (tag.label && tag.label.trim()) {
            const tagLabel = normalizeToUpperCase(tag.label.trim());

            // Avoid duplication: if product has discount, check if tag label matches discount label
            if (
              product.discount?.isActive &&
              product.discount?.amount &&
              product.discount
            ) {
              let discountLabel = "";
              if (product.discount.type === "percentage") {
                discountLabel = `-${product.discount.amount}%`;
              } else if (product.discount.type === "fixed") {
                discountLabel = `-${product.discount.amount}€`;
              }

              // Only add tag if it doesn't match the discount label
              if (tagLabel !== discountLabel) {
                discountsSet.add(tagLabel);
              }
            } else {
              // No active discount, add all discount tags
              discountsSet.add(tagLabel);
            }
          }
        });
      }
    });

    return Array.from(discountsSet).sort();
  }, [products]);

  const toggleDiscount = (discount: string) => {
    const newDiscounts = selectedDiscounts.includes(discount)
      ? selectedDiscounts.filter((d: string) => d !== discount)
      : [...selectedDiscounts, discount];

    onChange(newDiscounts);
  };

  if (availableDiscounts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No discounts available for this category.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {availableDiscounts.map((discount) => (
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
