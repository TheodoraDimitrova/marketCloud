"use client";
import React, { useRef, useState } from "react";
import Banner from "@/components/shared/banner/Benner";
import Carousel from "@/components/shared/carousel/Carousel";
import ImgCarousel from "@/components/shared/imgCarousel/ImgCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shared/productCard/ProductCard";
import SectionFilters from "@/components/SectionFilters/SectionFilters";
import UtilityBar from "@/components/shared/utilityBar/UtilityBar";

const arrayCategories = [
  <ImgCarousel
    key={1}
    totalProducts={17}
    title="Skincare"
    url="/category/skincare"
    src="/images/skincare.png"
  />,
  <ImgCarousel
    key={2}
    totalProducts={9}
    title="Cosmetic Bags"
    url="/category/Cosmetic-Bags"
    src="/images/bag01.png"
  />,
  <ImgCarousel
    key={3}
    totalProducts={4}
    title="Lipsticks"
    url="/category/lipsticks"
    src="/images/lipsticks.png"
  />,
  <ImgCarousel
    key={4}
    totalProducts={4}
    title="Makeup Sets"
    url="/category/makaup-Sets"
    src="/images/set01.png"
  />,
  <ImgCarousel
    key={5}
    totalProducts={14}
    title="Haircare"
    url="/category/haircare"
    src="/images/haircare.png"
  />,
  <ImgCarousel
    key={6}
    totalProducts={16}
    title="Makeup"
    url="/category/makeup"
    src="/images/categoryMakeup.png"
  />,
];
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
  const swiperRef = useRef(null);
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

        <div className="container mx-auto flex items-center justify-center mb-10">
          <button
            className="mr-2"
            onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="mx-4 text-md md:text-2xl">Explore our categories</h2>
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
  }
};

export default ProductsPage;
