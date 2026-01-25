import React from "react";
import Image from "next/image";
import Link from "next/link";

const shopItems = [
  {
    src: "/images/Technics&Styles.png",
    alt: "Exclusive Offers",
    href: "/deals",
    text: "Exclusive Offers",
  },
  {
    src: "/images/OurBlog.png",
    alt: "Categories",
    href: "/categories",
    text: "Categories",
  },
  {
    src: "/images/Products.png",
    alt: "Products",
    href: "/products",
    text: "Products",
  },

  {
    src: "/images/Brands.png",
    alt: "Best Sellers",
    href: "/products?discounts=Best+Seller",
    text: "Best Sellers",
  },
];

const ShopDropdown = () => {
  return (
    <div className="container flex flex-col md:flex-row justify-around items-center p-4 md:p-8 mx-auto overflow-auto h-auto md:h-auto space-y-4 md:space-y-0 pb-4 md:pb-8 md:space-x-8">
      {shopItems.map(({ src, alt, href, text }) => (
        <div key={alt} className="text-center w-full md:w-auto group">
          <Link href={href} className="flex flex-col md:block items-center md:items-start">
            {/* Images - Hidden on mobile */}
            <div className="hidden md:block relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
              <Image
                src={src}
                alt={alt}
                className="rounded-lg shadow-md transition-opacity duration-300 group-hover:opacity-90"
                width={120}
                height={180}
                style={{ height: "auto", width: "auto" }}
                sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
              />
            </div>

            {/* Text - Always visible, styled differently on mobile */}
            <h3 className="block mt-0 md:mt-3  hover:text-[#7d0d23] transition-colors duration-300 py-2 md:py-0">
              {text}
            </h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ShopDropdown;
