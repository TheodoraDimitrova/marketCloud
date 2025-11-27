"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import FilterBrands from "@/components/shared/filters/FilterBrands";
import FilterDiscounts from "@/components/shared/filters/FilterDiscounts";
import FilterPrice from "./FilterPrice";
import CollapsibleFilter from "./CollapsibleFilter";
import AppliedFilters from "./AppliedFilters";
import { Loading } from "@/components/ui/Loading";
import { Product } from "@/types/product";

type FilterType = "priceRange" | "brands" | "discounts";

const SectionFilter: React.FC<{
  toggleFilters: () => void;
  showFilter: boolean;
  onFiltersChange: (count: number) => void;
  products?: Product[];
}> = ({ toggleFilters, showFilter, onFiltersChange, products = [] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filters, setFilters] = useState<{
    priceRange: [number, number];
    brands: string[];
    discounts: string[];
  }>({
    priceRange: [1, 150],
    brands: [],
    discounts: [],
  });
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (!searchParams) return;

    const rawPriceRange = searchParams.get("priceRange");
    const parsedPriceRange =
      rawPriceRange && rawPriceRange.includes("-")
        ? rawPriceRange.split("-").map(Number)
        : [];

    setFilters({
      priceRange: parsedPriceRange as [number, number],
      brands: searchParams.get("brands")?.split(",") || [],
      discounts: searchParams.get("discounts")?.split(",") || [],
    });
  }, [searchParams]);

  const appliedFiltersCount = [
    filters.priceRange.length > 0,
    filters.brands.length > 0,
    filters.discounts.length > 0,
  ].filter(Boolean).length;

  useEffect(() => {
    onFiltersChange(appliedFiltersCount);
  }, [filters, onFiltersChange, appliedFiltersCount]);

  const handlePriceChange = (priceRange: [number, number]) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      setFilters((prevFilters) => ({ ...prevFilters, priceRange }));
      updateFilters("priceRange", priceRange.join("-"));
    }, 500);
    setDebounceTimeout(timeout);
  };

  const updateFilters = (filterType: FilterType, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      if (value.length > 0) {
        newParams.set(filterType, value.join(","));
      } else {
        newParams.delete(filterType);
      }
    } else {
      if (value) {
        newParams.set(filterType, value);
      } else {
        newParams.delete(filterType);
      }
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const removeFilter = (filterType: FilterType, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (filterType === "priceRange") {
      newParams.delete("priceRange");
    } else {
      const existingValues = newParams.get(filterType)?.split(",") || [];
      const newValues = existingValues.filter((item) => item !== value);

      if (newValues.length > 0) {
        newParams.set(filterType, newValues.join(","));
      } else {
        newParams.delete(filterType);
      }
    }

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm p-4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out  overflow-auto              
      ${showFilter ? "translate-x-0" : "-translate-x-full"}
      ${showFilter ? "lg:relative" : "lg:hidden"} lg:w-[280px] lg:translate-x-0 lg:shadow-none lg:h-auto text-gray-600 lg:z-10 z-30`}
    >
      <div className="flex flex-col ">
        {/* Mobile Header */}
        <header className="lg:hidden flex-between ">
          <h3>Filters</h3>
          <X
            size={24}
            onClick={toggleFilters}
            className="hover:text-red-500 transition"
          />
        </header>

        {/* Applied Filters */}
        <AppliedFilters
          initialFilters={{
            priceRange:
              filters.priceRange.length > 0
                ? [`€${filters.priceRange[0]} -  €${filters.priceRange[1]}`]
                : [],

            brands: filters.brands,
            discounts: filters.discounts,
          }}
          removeFilter={removeFilter}
          clearFilters={clearFilters}
        />

        {/* Filter Sections */}
        <CollapsibleFilter title="Price">
          <FilterPrice
            onChange={handlePriceChange}
            priceRange={filters.priceRange}
          />
        </CollapsibleFilter>

        <CollapsibleFilter title="Brands">
          <FilterBrands
            onChange={(values) => updateFilters("brands", values)}
            selectedBrands={filters.brands}
            products={products}
          />
        </CollapsibleFilter>

        <CollapsibleFilter title="Discounts">
          <FilterDiscounts
            onChange={(values: string[]) => updateFilters("discounts", values)}
            selectedDiscounts={filters.discounts}
          />
        </CollapsibleFilter>
      </div>
    </div>
  );
};

export default SectionFilter;
