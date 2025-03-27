import React from "react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    category: "Profesional Cosmetic Brands",
    items: [
      { name: "Adora Cosmetics", url: "/products?brands=Abora+Cosmetics" },
      { name: "HairCaVe", url: "/products?brands=HairCaVe" },
      { name: "Mira Pouch", url: "/products?brands=Mira+Pouch" },
    ],
  },
  {
    category: "Skincare",
    items: [
      { name: "Adora Cosmetics", url: "/products?brands=Abora+Cosmetics" },
      { name: "Kiehl's", url: "/products?brands=Kiehl's" },
      { name: "Glow Radiance", url: "/products?brands=Glow+Radiance" },
    ],
  },
  {
    category: "Haircare",
    items: [
      { name: "Pantene", url: "/products?brands=Pantene" },
      { name: "Keratin", url: "/products?brands=Keratin" },
    ],
  },
  {
    category: "Makeup",
    items: [
      { name: "MAC Cosmetics", url: "/products?brands=MAC+Cosmetics" },
      { name: "Fenty Beauty", url: "/products?brands=Fenty+Beauty" },
      { name: "Adora Cosmetics", url: "/products?brands=Abora+Cosmetics" },
    ],
  },
];

const BrandsDropdown = () => {
  return (
    <div className="lg:container flex-col md:flex-row space-y-4 pb-[100px] mx-auto flex h-screen overflow-scroll md:justify-between md:p-6  md:h-auto md:align-middle md:space-y-0 md:gap-4">
      {brands.map((brand, index) => (
        <div key={index}>
          <h3 className="font-bold">{brand.category}</h3>
          <ul>
            {brand.items.map((item, index) => (
              <li key={index}>
                <Link href={item.url}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Image Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 ">
        {["/images/Products.png", "/images/Brands.png"].map((src, index) => (
          <div key={index}>
            <Image
              src={src}
              alt="Brand Ad"
              className="rounded"
              width={150}
              height={200}
              style={{ width: "auto", height: "auto" }}
              sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsDropdown;
