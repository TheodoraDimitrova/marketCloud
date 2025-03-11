"use client";
import React from "react";
import ImgOverlayText from "@/components/shared/imgOverlayText/ImgOverlayText";
import Carousel from "@/components/shared/carousel/Carousel";
import { useSelector } from "react-redux";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchCategories } from "@/store/slices/categorySlice";
import { urlFor } from "@/sanity/lib/image";
import { RootState } from "@/store/store";
import Loading from "../shared/loading/loading";

interface Category {
  id: string;
  name: string;
  subheading?: string;
  image: string;
}

const SectionCarousel = () => {
  const { status } = useFetchData(fetchCategories, "categories");
  const { categories } = useSelector((state: RootState) => state.categories);
  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div>Error loading categories</div>;
  }

  const arrayCategories = categories
    .slice(0, 3)
    .map((category: Category) => (
      <ImgOverlayText
        key={category.id}
        subheading={category.subheading || "Discover Your Glow"}
        title={category.name}
        textBtn={`Shop ${category.name}`}
        url={`/category/${category.id}`}
        src={urlFor(category.image)}
      />
    ));

  return (
    <div className="container m-auto flex items-center justify-between y-12 p-5">
      <Carousel
        items={arrayCategories}
        slidesPerView={3}
        spaceBetween={20}
        autoplay={false}
        loop={false}
      />
    </div>
  );
};

export default SectionCarousel;
