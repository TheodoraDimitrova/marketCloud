import React from "react";
import ImgOverlayText from "@/components/shared/imgOverlayText/ImgOverlayText";
import Carousel from "@/components/shared/carousel/Carousel";

const SectionCarousel = () => {
  const arrayCategories = [
    <ImgOverlayText
      key={1}
      subheading="Discover Your Glow"
      title="Skincare"
      textBtn="Shop Skincare"
      url="/categories/skincare"
      src="/images/skincare.png"
    />,
    <ImgOverlayText
      key={2}
      subheading="Nourish Your Hair"
      title="Haircare"
      textBtn="Shop Haircare"
      url="/categories/haircare"
      src="/images/haircare.png"
    />,
    <ImgOverlayText
      key={3}
      subheading="Enhance Your Beauty"
      title="Makeup"
      textBtn="Shop Makeup"
      url="/categories/makeup"
      src="/images/categoryMakeup.png"
    />,
  ];

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
