import React from "react";
import Image from "next/image";
import Link from "next/link";

const BrandsDropdown = () => {
  return (
    <div className="lg:container flex-col md:flex-row space-y-6 mx-auto flex justify-around  p-6  h-screen md:h-auto overflow-auto  pb-28 md:pb-6">
      <div>
        <h3 className="font-bold">Professional Cosmetic Brands</h3>
        <ul>
          <li>
            <Link href="/brands/nike">La Mer</Link>
          </li>
          <li>
            <Link href="/brands/adidas">MDermalogica</Link>
          </li>
          <li>
            <Link href="/brands/EstéeLauder">Sisley</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold">Skincare</h3>
        <ul>
          <li>
            <Link href="/brands/nike">L&apos;Oréal</Link>
          </li>
          <li>
            <Link href="/brands/adidas">Maybelline</Link>
          </li>
          <li>
            <Link href="/brands/EstéeLauder">Estée Lauder</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold">Haircare</h3>
        <ul>
          <li>
            <Link href="/brands/nike">Pantene</Link>
          </li>
          <li>
            <Link href="/brands/nike">L&apos;Oréal</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold">Makeup</h3>
        <ul>
          <li>
            <Link href="/brands/mac">MAC Cosmetics</Link>
          </li>
          <li>
            <Link href="/brands/EstéeLauder">Fenty Beauty</Link>
          </li>
          <li>
            <Link href="/brands/EstéeLauder">Adora Cosmetics</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 md:w-1/3">
        <div>
          <Image
            src="/images/Products.png"
            alt="Brand Ad"
            className="rounded"
            width={100}
            height={150}
            style={{ width: "auto", height: "auto" }}
            sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
          />
        </div>
        <div>
          <Image
            src="/images/Brands.png"
            className="rounded"
            alt="Brand Ad"
            width={100}
            height={150}
            style={{ width: "auto", height: "auto" }}
            sizes="(min-width: 1600px) 25vw, (min-width: 768px) 25vw , 100vw"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandsDropdown;
