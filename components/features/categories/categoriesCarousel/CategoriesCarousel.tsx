"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel } from "@/components/ui/Carousel";
import ImgCarousel from "@/components/features/categories/categoriesCarousel/ImgCarousel";
import { urlFor } from "@/sanity/lib/image";
import { useAppSelector } from "@/hooks/useAppSelector";
import Swiper from "swiper";

const CategoriesCarousel = () => {
  const swiperRef = useRef<Swiper | null>(null);
  const { categories, status } = useAppSelector((state) => state.categories);

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
        <h2>Explore our categories</h2>
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
              key={category._id}
              totalProducts={category.totalProducts || 0}
              title={category.name}
              url={`/category/${category.slug.current}`}
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
