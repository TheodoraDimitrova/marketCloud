import React from "react";
import Image from "next/image";
import Link from "next/link";

const ShopDropdown = () => {
  return (
    <div
      className="container flex flex-col md:flex-row justify-around items-center p-6 mx-auto overflow-auto
     h-screen md:h-auto space-y-6 md:space-y-0 pb-28 md:pb-6 md:space-x-6"
    >
      <div>
        <Image
          src="/images/Technics&Styles.png"
          alt="Technics & Styles"
          className="rounded"
          width={100}
          height={150}
          style={{ width: "auto", height: "auto" }}
          sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
        />
        <Link href="/collections/category1" className="block mt-2 text-center">
          Technics & Styles
        </Link>
      </div>
      <div>
        <Image
          src="/images/OurBlog.png"
          alt="Blog"
          className="rounded"
          width={100}
          height={150}
          style={{ width: "auto", height: "auto" }}
          sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
        />
        <Link href="/collections/category2" className="block mt-2 text-center">
          Our Blog
        </Link>
      </div>
      <div>
        <Image
          src="/images/Products.png"
          alt="Products "
          className="rounded"
          width={100}
          height={150}
          style={{ width: "auto", height: "auto" }}
          sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
        />
        <Link href="/collections/category3" className="block mt-2 text-center">
          Products
        </Link>
      </div>
      <div>
        <Image
          src="/images/Brands.png"
          alt="Brands"
          className="rounded"
          width={100}
          height={150}
          style={{ width: "auto", height: "auto" }}
          sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
        />
        <Link href="/collections/brands" className="block mt-2 text-center">
          Brands
        </Link>
      </div>
    </div>
  );
};

export default ShopDropdown;
