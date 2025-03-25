"use client";
import React from "react";
import ImgOverlayText from "@/components/homeSections/ImgOverlayText";
import Carousel from "@/components/shared/Carousel";
import { useSelector } from "react-redux";
import { urlFor } from "@/sanity/lib/image";
import { RootState } from "@/store/store";
import Loading from "../shared/Loading";
import { Category } from "@/types/category";

const CarouselHome = () => {
  const { categories, status } = useSelector(
    (state: RootState) => state.categories
  );
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
        key={category._id}
        subheading={category.subheading || "Discover Your Glow"}
        title={category.name}
        textBtn={`Shop ${category.name}`}
        url={`/category/${category.slug.current}`}
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

export default CarouselHome;
