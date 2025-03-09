"use client";
import React, { useState } from "react";
import Banner from "@/components/shared/banner/Benner";
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
const ProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  {
    return (
      <>
        <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />
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
  }
};

export default ProductsPage;
