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

type UtilityBarProps = {
  toggleFilters: () => void;
  totalProducts: number;
  appliedFiltersCount: number;
  showFilters: boolean;
};

const UtilityBar: React.FC<UtilityBarProps> = ({
  toggleFilters,
  totalProducts,
  appliedFiltersCount,
  showFilters,
}) => {
  const handleClick = () => {
    toggleFilters();
  };
  return (
    <div className="container flex mx-auto m-3 px-4 ">
      {/* Left Section */}
      <button
        type="button"
        className="bar-left flex items-center justify-start w-full sm:w-1/3 text-gray-700 bg-transparent border-none p-0 cursor-pointer"
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
      <div className="bar-middle flex-center w-full sm:w-1/3 text-gray-700">
        <p>{totalProducts} products</p>
      </div>

      {/* Right Section */}
      <div className="hidden bar-right w-full sm:w-1/3 lg:flex items-center justify-end relative">
        <Select>
          <SelectTrigger className="w-[180px] border-none text-md text-gray-700  ">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="absolute top-0 left-0">
            <SelectGroup>
              <SelectItem value="best-selling">Best Selling</SelectItem>
              <SelectItem value="a-z">Alphabetically, A-Z</SelectItem>
              <SelectItem value="z-a">Alphabetically, Z-A</SelectItem>
              <SelectItem value="low-to-high">Price, low to high</SelectItem>
              <SelectItem value="high-to-low">Price, high to low</SelectItem>
              <SelectItem value="old-to-new">Date, old to new</SelectItem>
              <SelectItem value="new-to-old">Date, new to old</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UtilityBar;
