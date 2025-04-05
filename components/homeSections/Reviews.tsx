"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Reviews = () => {
  const reviews = [
    {
      text: "I’m absolutely impressed with AdoraRed Essence! This product is a game-changer. After just one use, I noticed a significant improvement in my skin’s clarity. The texture is incredibly smooth, and the red charcoal blends perfectly into my skincare routine.",
      author: "Adele S, Toronto",
      image: "/images/img2.png",
      product: "Adora Red Essence",
      productLink: "/product/2",
    },
    {
      text: "AdoraRed Ember has truly exceeded my expectations!I love how it detoxifies and energizes my skin, giving it a healthy glow. I highly recommend this product to anyone looking for an effective, natural skincare solution. ",
      author: "Izzy, London",
      image: "/images/img1.png",
      product: "Adora Red Ember",
      productLink: "/product/1",
    },
    {
      text: "I love using it on my cheekbones, brow bones, and cupid’s bow for that fresh, glowing finish. I highly recommend this highlighter for anyone looking to add a touch of rose-gold luminosity to their look!",
      author: "Betina, Varna",
      image: "/images/img3.png",
      product: "Adora Rose Glow Highlighter",
      productLink: "/product/3",
    },
    {
      text: "This brown lipstick has the perfect balance of deep mocha tones with a touch of warmth. It applies smoothly and feels so luxurious on my lips.MAC Mocha Luxe is my new favorite ",
      author: "Anna, Sofia",
      image: "/images/img4.png",
      product: "MAC Mocha Luxe",
      productLink: "/product/4",
    },
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 9000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevReview = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        {/* Review */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex-between flex-col md:flex-row">
            <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0 text-left">
              <p className=" text-xs font-medium tracking-wider leading-5 uppercase mb-8">
                Customer reviews
              </p>
              <motion.p
                key={currentReview}
                className="flex pb-4"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {Array(5)
                  .fill("a")
                  .map((_, index) => (
                    <Star
                      key={index}
                      className="text-black w-4 h-4 fill-current"
                    />
                  ))}
              </motion.p>
              <motion.p
                className="text-lg italic text-gray-600 mb-4"
                key={`text-${currentReview}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {`"${reviews[currentReview].text}"`}
              </motion.p>
              <motion.p
                className="text-md text-gray-700"
                key={`author-${currentReview}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                — {reviews[currentReview].author}
              </motion.p>

              <div className="flex justify-items-start m-6 space-x-4">
                <button
                  onClick={prevReview}
                  className={`p-2 rounded-md hover:bg-gray-400 focus:outline-none ${
                    currentReview !== reviews.length - 1
                      ? "bg-gray-300"
                      : "bg-gray-200"
                  }`}
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={nextReview}
                  className={`p-2 rounded-md hover:bg-gray-400 focus:outline-none ${
                    currentReview !== reviews.length - 1
                      ? "bg-gray-200"
                      : "bg-gray-300"
                  }`}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center md:w-1/2">
              <Image
                src={reviews[currentReview].image}
                alt={reviews[currentReview].product}
                width={360}
                height={360}
                className="object-cover rounded-lg mb-4"
              />
              <Link
                href={reviews[currentReview].productLink}
                className="underline"
              >
                <p className="text-lg font-medium">
                  {reviews[currentReview].product}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
