"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, AlignJustify } from "lucide-react";

import { usePathname } from "next/navigation";
import HeaderLinks from "./HeaderLinks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdowns from "./Dropdowns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import CartDrawer from "../cartDrawer/CartDrawer";

const NavBar = () => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isScrolledDown) {
        setIsScrolledDown(true);
      } else if (window.scrollY === 0 && isScrolledDown) {
        setIsScrolledDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolledDown]);

  const links = [
    {
      href: "/collections/all",
      label: "SHOP",
      dropdown: (
        <div className="container flex justify-around items-center p-6 mx-auto">
          <div>
            <Image
              src="/images/Technics&Styles.png"
              alt="Technics & Styles"
              className="rounded"
              width={100}
              height={150}
              style={{ width: "100%", height: "auto" }}
              sizes="(min-width: 1600px) 13vw, (min-width: 768px) 8vw , 13vw"
            />
            <Link
              href="/collections/category1"
              className="block mt-2 text-center"
            >
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
              style={{ width: "100%", height: "auto" }}
              sizes="(min-width: 1600px) 13vw, (min-width: 768px) 10vw , 13vw"
            />
            <Link
              href="/collections/category2"
              className="block mt-2 text-center"
            >
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
              sizes="(min-width: 1600px) 13vw, (min-width: 768px) 10vw , 13vw"
            />
            <Link
              href="/collections/category3"
              className="block mt-2 text-center"
            >
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
              style={{ width: "100%", height: "auto" }}
              sizes="(min-width: 1600px) 13vw, (min-width: 768px) 10vw , 13vw"
            />
            <Link href="/collections/brands" className="block mt-2 text-center">
              Brands
            </Link>
          </div>
        </div>
      ),
    },
    {
      href: "#",
      label: "BRANDS",
      dropdown: (
        <div className="lg:container mx-auto flex justify-around  p-6 ">
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
          <div className="flex justify-between gap-4">
            <div>
              <Image
                src="/images/Products.png"
                alt="Brand Ad"
                width={100}
                height={200}
                style={{ width: "100%", height: "auto" }}
                sizes="(min-width: 1600px) 13vw, (min-width: 768px) 10vw , 13vw"
              />
            </div>
            <div>
              <Image
                src="/images/Brands.png"
                alt="Brand Ad"
                width={100}
                height={200}
                style={{ width: "100%", height: "auto" }}
                sizes="(min-width: 1600px) 13vw, (min-width: 768px) 10vw , 13vw"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      href: "/pages/our-world",
      label: "OUR WORLD",
      dropdown: (
        <div className="relative flex items-center bg-white h-[50vh] max-h-[60vh] ">
          <div className="w-1/2  p-10 flex flex-col z-20 ">
            <div className="m-9 w-4/5 mx-auto text-center">
              <h1 className="mb-6">Amazing Experience</h1>
              <p className="text-lg">
                Discover how we blend visuals with text to create a seamless and
                engaging design. The transition effect brings harmony between
                sections.
              </p>
              <div className="flex space-x-4 mt-4 justify-center">
                <Button asChild>
                  <Link href="/collections/best">Best Sellers</Link>
                </Button>
                <Button asChild>
                  <Link href="/collections/new">New arrivals</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f2979c] to-transparent  transition-all duration-700 ease-in-out "></div>

          <div
            className="w-1/2 bg-cover bg-center h-full"
            style={{
              backgroundImage: "url('/images/makeup.png')",
            }}
          ></div>
        </div>
      ),
    },
    {
      href: "#",
      label: "DEMOS",
      dropdown: (
        <div className="p-4 w-auto">
          <div className="mt-4 text-center">
            <Image
              src="/images/img2.png"
              alt="Demo Slide"
              width={250}
              height={250}
              className="rounded"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              View Demo
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`${
        isHomePage && (isScrolledDown || isHovered)
          ? " bg-white sticky top-0 text-black "
          : isHomePage
          ? "bg-transparent absolute top-30 text-white"
          : "bg-white sticky top-0 text-black border-b border-gray-300"
      }  w-full z-50 transition-all duration-700 `}
      onMouseEnter={() => isHomePage && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveIndex(null);
      }}
    >
      <div className="relative mx-auto flex lg:flex-row md:flex-col-reverse md:gap-2 items-center justify-between px-4 py-2">
        {/* Left Section */}

        <div className="flex items-center ">
          <div className="flex md:hidden items-center space-x-1 md:space-x-4">
            <AlignJustify onClick={() => setIsMobileMenuOpen(true)} />
            <Search onClick={() => router.push("/search")} />
          </div>
          {/* Left Section */}
          <div>
            <HeaderLinks links={links} setActiveIndex={setActiveIndex} />
          </div>
        </div>

        {/* Middle Section (Logo) */}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-6 lg:top-1/2">
          <div className="font-bold uppercase text-center align-middle">
            <Link href="/">Adora Cosmetics</Link>
          </div>
        </div>

        {/* Right Section */}

        <div className="z-2 flex items-center space-x-1 md:space-x-4 md:w-full md:justify-end lg:w-auto">
          <Search
            onClick={() => router.push("/search")}
            className="hidden lg:inline-flex"
          />
          {/* <ShoppingBag onClick={() => console.log("open cart menu")} /> */}

          <button onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              1
            </span>
          </button>

          <div
            onClick={() => router.push("/account/login")}
            className="cursor-pointer"
          >
            <User />
          </div>
        </div>
      </div>
      {activeIndex !== null && (
        <Dropdowns dropdown={links[activeIndex].dropdown} />
      )}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 w-full lg:relative min-h-screen bg-black opacity-50 z-40 lg:hidden" />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default NavBar;
