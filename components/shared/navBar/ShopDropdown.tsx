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
    href: "/category/best-sellers",
    text: "Best Sellers",
  },
];

const ShopDropdown = () => {
  return (
    <div className="container flex flex-col md:flex-row justify-around items-center p-6 mx-auto overflow-auto h-screen md:h-auto space-y-6 md:space-y-0 pb-28 md:pb-6 md:space-x-6">
      {shopItems.map(({ src, alt, href, text }) => (
        <div key={alt} className="text-center">
          <Link href={href}>
            <Image
              src={src}
              alt={alt}
              className="rounded"
              width={100}
              height={150}
              style={{ height: "auto", width: "auto" }}
              sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
            />

            <p className="block mt-2"> {text} </p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ShopDropdown;
