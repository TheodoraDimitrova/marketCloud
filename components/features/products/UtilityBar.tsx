"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { SlidersHorizontal } from "lucide-react";
import { ChevronRight } from "lucide-react";

type SortOption =
  | "a-z"
  | "z-a"
  | "low-to-high"
  | "high-to-low"
  | "old-to-new"
  | "new-to-old";

type UtilityBarProps = {
  toggleFilters: () => void;
  totalProducts: number;
  appliedFiltersCount: number;
  showFilters: boolean;
  onSortChange: (value: SortOption) => void;
};

const UtilityBar = ({
  toggleFilters,
  totalProducts,
  appliedFiltersCount,
  showFilters,
  onSortChange,
}: UtilityBarProps) => {
  const handleClick = () => {
    toggleFilters();
  };

  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption);
  };
  return (
    <div className="container flex items-center justify-between mx-auto m-3 px-4">
      {/* Left Section */}
      <button
        type="button"
        className="bar-left flex items-center justify-start text-gray-700 bg-transparent border-none p-0 cursor-pointer"
        onClick={handleClick}
      >
        <SlidersHorizontal className="mr-2" />

        <span className="mr-2">Filters</span>
        {appliedFiltersCount > 0 && (
          <span className="text-sm text-red-500">({appliedFiltersCount})</span>
        )}
        <span className="transition-transform duration-300">
          <ChevronRight
            className={`transform ${
              showFilters ? "rotate-180" : ""
            } hidden lg:block`}
          />
        </span>
      </button>

      {/* Middle Section */}
      <div className="bar-middle flex items-center justify-center text-gray-700">
        <p>{totalProducts} products</p>
      </div>

      {/* Right Section */}
      <div className="hidden bar-right lg:flex items-center justify-end gap-2">
        <span className="text-gray-700 text-md">Sort by:</span>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px] !h-auto !mt-0 !py-0 border-none text-md text-gray-700 [&>svg]:!h-6 [&>svg]:!w-6 [&>svg]:!opacity-100 [&>svg]:text-gray-700">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent align="end" side="bottom" className="!rounded-xl">
            <SelectGroup>
              <SelectItem value="new-to-old">Date, new to old</SelectItem>
              <SelectItem value="old-to-new">Date, old to new</SelectItem>
              <SelectItem value="low-to-high">Price, low to high</SelectItem>
              <SelectItem value="high-to-low">Price, high to low</SelectItem>
              <SelectItem value="a-z">Alphabetically, A-Z</SelectItem>
              <SelectItem value="z-a">Alphabetically, Z-A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UtilityBar;
