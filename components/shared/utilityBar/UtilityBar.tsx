import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { ChevronRight } from "lucide-react";

type UtilityBarProps = {
  toggleFilters: () => void;
};

const UtilityBar: React.FC<UtilityBarProps> = ({ toggleFilters }) => {
  const [isRotated, setIsRotated] = useState(false);
  const handleClick = () => {
    setIsRotated((prev) => !prev);
    toggleFilters();
  };
  return (
    <div className="container flex mx-auto m-3 px-4 ">
      {/* Left Section */}
      <div
        className="bar-left flex items-center justify-start w-full sm:w-1/3 text-gray-700"
        onClick={handleClick}
      >
        <SlidersHorizontal className="mr-2" />

        <span className="mr-2">Filters</span>
        <span>(2)</span>
        <button className="transition-transform duration-300">
          <ChevronRight
            className={`transform ${
              isRotated ? "rotate-180" : ""
            } hidden lg:block`}
          />
        </button>
      </div>

      {/* Middle Section */}
      <div className="bar-middle flex justify-center items-center w-full sm:w-1/3 text-gray-700">
        <p>37 products</p>
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
