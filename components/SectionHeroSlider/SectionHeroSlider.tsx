"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.activeIndex);
  };
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      speed={1000}
      onSlideChange={handleSlideChange}
      className="relative h-[calc(100vh-150px)] w-full"
    >
      <SwiperSlide>
        <div className="relative h-full min-h-[500px]">
          <Image
            src="/images/slide1.png"
            alt="Slide 1"
            className="object-cover"
            fill={true}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            {activeIndex === 0 && (
              <div className="flex flex-grow flex-col items-end text-white space-y-4 p-5 m-5">
                <AnimatePresence>
                  <motion.div
                    key={`text1-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9 }}
                    className="text-sm font-light uppercase"
                  >
                    new new new
                  </motion.div>

                  <motion.div
                    key={`text2-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="text-4xl md:text-6xl text-right max-w-md"
                  >
                    Discover Our Collection
                  </motion.div>

                  <motion.div
                    key={`text3-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="text-lg max-w-m"
                  >
                    <p>Be the first to shop the drop</p>
                  </motion.div>

                  <motion.div
                    key={`text4-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.9 }}
                    className="text-lg max-w-m"
                  >
                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4 w-full">
                      <Button
                        asChild
                        variant="link"
                        className="w-full md:w-auto text-center mb-4"
                      >
                        <Link href="/products?discounts=Best+Seller">
                          Best Sellers
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="link"
                        className="w-full md:w-auto text-center"
                      >
                        <Link href="/products?discounts=New+Arrival">
                          New arrivals
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="relative h-full min-h-[500px]">
          <Image
            src="/images/slide2.png"
            alt="Slide 2"
            fill
            className="object-cover"
          />
          {activeIndex === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Content */}
              <div className="flex flex-grow flex-col  text-white space-y-4  p-5 m-5">
                <AnimatePresence>
                  <motion.div
                    key={`text1-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9 }}
                    className="text-sm font-light uppercase"
                  >
                    Exclusive 24-Hour Flash Sale
                  </motion.div>

                  <motion.div
                    key={`text2-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="text-4xl md:text-6xl max-w-md text-left"
                  >
                    Exclusive Offer Just for You!
                  </motion.div>

                  <motion.div
                    key={`text3-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="text-lg max-w-md"
                  >
                    Get your hands on our limited-edition cosmetics before
                    they’re gone!
                  </motion.div>

                  <motion.div
                    key={`text4-${activeIndex}`} // Променя ключа на базата на активния индекс
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.9 }}
                  >
                    <div className="flex space-x-4 mt-4">
                      <Button asChild variant={"link"}>
                        <Link href="/deals">Grab the Deal</Link>
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="relative h-full min-h-[500px]">
          <Image
            src="/images/slide3.png"
            alt="Slide 2"
            fill
            className="object-cover"
          />
          {activeIndex === 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Content */}
              <div className="flex flex-grow flex-col  text-white space-y-4  p-5 m-5">
                <AnimatePresence>
                  <motion.div
                    key={`text1-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9 }}
                    className="text-sm font-light uppercase"
                  >
                    Shop Best-Sellers
                  </motion.div>

                  <motion.div
                    key={`text2-${activeIndex}`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="text-4xl md:text-6xl max-w-md text-left"
                  >
                    Our Best-Selling Products
                  </motion.div>

                  <motion.div
                    key={`text3-${activeIndex}`} // Променя ключа на базата на активния индекс
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                    className="text-lg max-w-md"
                  >
                    Explore our most popular products that will transform your
                    skin. Enjoy visible results from the very first use!
                  </motion.div>

                  <motion.div
                    key={`text4-${activeIndex}`} // Променя ключа на базата на активния индекс
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.9, delay: 0.9 }}
                  >
                    <div className="flex space-x-4 mt-4">
                      <Button asChild variant={"link"}>
                        <Link href="/deals">Get Free Shipping</Link>
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroSlider;
