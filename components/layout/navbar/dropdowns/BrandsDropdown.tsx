import React from "react";
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
    <div className="lg:container mx-auto p-4 md:p-8 pb-4 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {brands.map((brand, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
              {brand.category}
            </h3>
            <ul className="space-y-2 flex-1">
              {brand.items.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.url} 
                    className="text-sm md:text-base text-gray-600 hover:text-[#7d0d23] transition-colors duration-300 block py-1.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsDropdown;
