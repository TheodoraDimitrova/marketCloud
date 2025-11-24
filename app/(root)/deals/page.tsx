import React from "react";
import Image from "next/image";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const DealsPage = () => {
  const offers = [
    {
      title: "20% Off on Lipsticks",
      description:
        "Get the best lipsticks at half the price! Limited time only.",
      image: "/images/bg1.png",
      link: "category/lipsticks",
      discount: "20% Off",
    },
    {
      title: "Buy 1 Get 1 Free on Skincare",
      description: "Buy any skincare product and get one for free. Hurry up!",
      image: "/images/bg2.png",
      link: "category/skincare",
      discount: "Buy 1 Get 1 Free",
    },
    {
      title: "Free Shipping on Orders Over €60",
      description: "Enjoy free shipping on all orders above €60. Shop now!",
      image: "/images/bg3.png",
      link: "/products",
      discount: "Free Shipping",
    },
  ];

  return (
    <>
      <Banner
        title="Exclusive Offers"
        backgroundImage="/images/bg4.png"
        subtitle="   Don't miss out on our best deals! Grab them before they're gone."
      />
      <div className="container mx-auto p-8">
        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className=" rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
            >
              {/* Image Section */}
              <Image
                src={offer.image}
                width={400}
                height={250}
                alt={offer.title}
                className="w-full h-64 object-cover"
              />

              {/* Info Section */}
              <div className="p-6">
                <h3>{offer.title}</h3>
                <p className="mt-2 text-lg text-gray-600">
                  {offer.description}
                </p>

                {/* Discount Badge */}
                <span className="inline-block mt-4 bg-red-500 text-white py-1 px-4 rounded-full text-sm">
                  {offer.discount}
                </span>

                {/* CTA Button */}
                <Button className="mt-4 w-full" size="sm">
                  <Link href={offer.link}>Shop Now </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with limited time offers */}
        <div className="mt-12 text-center">
          <h3>Hurry, These Offers Won&apos;t Last!</h3>
          <p className="mt-2 text-lg text-gray-600">
            Act fast, the clock is ticking!
          </p>
        </div>
      </div>
    </>
  );
};

export default DealsPage;
