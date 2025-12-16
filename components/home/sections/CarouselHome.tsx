"use client";
import React from "react";
import ImgOverlayText from "@/components/home/sections/ImgOverlayText";
import { Carousel } from "@/components/ui/Carousel";
import { urlFor } from "@/sanity/lib/image";
import { Loading } from "@/components/ui/Loading";
import { Category } from "@/lib/types/category";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const CarouselHome = () => {
  const { categories, status, error } = useAppSelector(
    (state) => state.categories
  );
  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <ErrorMessage message={error} />;
  }
  const safeCategories = Array.isArray(categories) ? categories : [];
  const arrayCategories = safeCategories
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
