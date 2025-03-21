"use client";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "@/components/shared/carousel/Carousel"; // Ако не е импортирано
import ImgCarousel from "@/components/shared/imgCarousel/ImgCarousel"; // Ако не е импортирано
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchCategories } from "@/store/slices/categorySlice";
import { urlFor } from "@/sanity/lib/image";

const CategoriesCarousel = () => {
  const swiperRef = useRef(null);

  const { status } = useFetchData(fetchCategories, "categories");
  const { categories } = useSelector((state: RootState) => state.categories);

  if (status === "loading") {
    return <div>Loading categories...</div>;
  }

  if (status === "failed") {
    return <div>Error loading categories</div>;
  }

  return (
    <div>
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
          items={categories.map((category) => (
            <ImgCarousel
              key={category.id}
              totalProducts={category.totalProducts || 0}
              title={category.name}
              url={`/category/${category.id}`}
              src={urlFor(category.image)}
            />
          ))}
          slidesPerView={3}
          spaceBetween={20}
          autoplay={false}
          loop={false}
          navigation={false}
          swiperRef={swiperRef}
        />
      </div>
    </div>
  );
};

export default CategoriesCarousel;
