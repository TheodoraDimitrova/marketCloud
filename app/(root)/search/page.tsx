"use client";

import React, { useRef, useState } from "react";
import Banner from "@/components/shared/banner/Benner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Carousel from "@/components/shared/carousel/Carousel";
import ImgCarousel from "@/components/shared/imgCarousel/ImgCarousel";
import { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import SectionFilters from "@/components/SectionFilters/SectionFilters";
import UtilityBar from "@/components/shared/utilityBar/UtilityBar";

const SearchPage = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSearch = () => {
    console.log("Search For:", searchTerm);
  };

  const arrayCategories = [
    <ImgCarousel
      key={1}
      totalProducts={17}
      title="Skincare"
      url="/categories/skincare"
      src="/images/skincare.png"
    />,
    <ImgCarousel
      key={2}
      totalProducts={9}
      title="Cosmetic Bags"
      url="/categories/Cosmetic-Bags"
      src="/images/bag01.png"
    />,
    <ImgCarousel
      key={3}
      totalProducts={4}
      title="Lipsticks"
      url="/categories/lipsticks"
      src="/images/lipsticks.png"
    />,
    <ImgCarousel
      key={4}
      totalProducts={4}
      title="Makeup Sets"
      url="/categories/makaup-Sets"
      src="/images/set01.png"
    />,
    <ImgCarousel
      key={5}
      totalProducts={14}
      title="Haircare"
      url="/categories/haircare"
      src="/images/haircare.png"
    />,
    <ImgCarousel
      key={6}
      totalProducts={16}
      title="Makeup"
      url="/categories/makeup"
      src="/images/categoryMakeup.png"
    />,
  ];

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
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-center mb-10">
        <button
          className="mr-2"
          onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="mx-4 text-md md:text-2xl">Explore our collections</h2>
        <button
          className="ml-2"
          onClick={() => swiperRef.current && swiperRef.current.slideNext()}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="ml-4 md:ml-20 mb-20">
        <Carousel
          items={arrayCategories}
          slidesPerView={3}
          spaceBetween={20}
          autoplay={false}
          loop={false}
          navigation={false}
          swiperRef={swiperRef}
        />
      </div>
    </>
  );
};

export default SearchPage;
