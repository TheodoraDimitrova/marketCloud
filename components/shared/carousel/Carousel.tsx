"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ReactNode, useEffect } from "react";
import SwiperCore from "swiper";

interface CarouselProps {
  items: ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  autoplay?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  loop?: boolean;
  swiperRef?: React.RefObject<SwiperCore | null>;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  slidesPerView = 1,
  spaceBetween = 0,
  autoplay = false,
  navigation = false,
  pagination = false,
  loop = false,
  swiperRef,
}) => {
  const adjustedSlidesPerView = items.length > 4 ? 3.5 : 3;
  useEffect(() => {
    if (swiperRef?.current) {
      swiperRef.current.update();
    }
  }, [swiperRef]);

  return (
    <Swiper
      onSwiper={(swiper) => {
        if (swiperRef && "current" in swiperRef) {
          swiperRef.current = swiper;
        }
      }}
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView || adjustedSlidesPerView}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
      loop={loop}
      breakpoints={{
        320: {
          slidesPerView: 1.3,
          spaceBetween: 10,
        },
        425: {
          slidesPerView: 2.3,
          spaceBetween: 10,
        },

        767: {
          slidesPerView: adjustedSlidesPerView,
          spaceBetween: 50,
        },
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
