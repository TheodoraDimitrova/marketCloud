"use client";

import React, { useState } from "react";
import Banner from "@/components/shared/banner/Benner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import SectionFilters from "@/components/SectionFilters/SectionFilters";
import UtilityBar from "@/components/shared/utilityBar/UtilityBar";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";

const products = [
  {
    id: 1,
    name: "Adora Red Essence",
    image: "/images/img1.png",
    price: "14.00 €",
    tags: ["New Arrival", "Exclusive", "8% off"],
  },
  {
    id: 2,
    name: "Adora Blue Essence",
    image: "/images/products.png",
    price: "16.00 €",
    tags: ["Best Seller", "Exclusive"],
  },
  {
    id: 3,
    name: "Adora Green Essence",
    image: "/images/img2.png",
    price: "12.00 €",
    tags: ["Sale", "New Arrival"],
  },
  {
    id: 4,
    name: "Adora Yellow Essence",
    image: "/images/img3.png",
    price: "18.00 €",
    tags: ["Exclusive", "10% off"],
  },
  {
    id: 5,
    name: "Adora Pink Essence",
    image: "/images/img4.png",
    price: "20.00 €",
    tags: ["New Arrival"],
  },
  {
    id: 6,
    name: "Adora Purple Essence",
    image: "/images/img5.png",
    price: "22.00 €",
    tags: ["Exclusive", "Sale"],
  },
  {
    id: 7,
    name: "Adora Orange Essence",
    image: "/images/products.png",
    price: "25.00 €",
    tags: ["New Arrival", "8% off"],
  },
];

const SearchPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSearch = () => {
    console.log("Search For:", searchTerm);
  };

  return (
    <>
      <Banner title="Search Adora" backgroundImage="/images/bg1.png" />

      {/* Search bar */}
      <div className="container w-[80%] md:max-w-[650px] md:w-full mx-auto my-10 md:my-20">
        <div className="relative mt-4">
          <Input
            className="p-2 pl-10 bg-gray-200 w-full placeholder:text-gray-500 placeholder:text-lg border-none"
            placeholder="Search our Store"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute inset-y-0 right-3 w-6 h-6 top-2 text-gray-500"
            onClick={handleSearch}
          />
        </div>
      </div>
      {/* Search bar */}

      <UtilityBar toggleFilters={toggleFilters} />

      <div className="container w-full h-full flex mx-auto ">
        {showFilters && (
          <>
            <div className="fixed inset-0 w-full lg:relative min-h-screen bg-black opacity-50 z-50 lg:hidden" />
            <SectionFilters
              toggleFilters={toggleFilters}
              showFilter={showFilters}
            />
          </>
        )}
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 lg:gap-4 p-10 lg:gap-y-8  justify-items-center items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <CategoriesCarousel />
    </>
  );
};

export default SearchPage;
