"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, AlignJustify } from "lucide-react";
import { usePathname } from "next/navigation";
import HeaderLinks from "./HeaderLinks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdowns from "./dropdowns/Dropdowns";
import MobileMenu from "./MobileMenu";
import CartDrawer from "@/components/cartDrawer/CartDrawer";
import ShopDropdown from "./dropdowns/ShopDropdown";
import BrandsDropdown from "./dropdowns/BrandsDropdown";
import OurWorldDropdown from "./dropdowns/OurWorldDropdown";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const NavBar = () => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const cartItems = useSelector((state: RootState) => state.cart.items);

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
      href: "/categories",
      label: "SHOP",
      dropdown: <ShopDropdown />,
    },
    {
      href: "#",
      label: "BRANDS",
      dropdown: <BrandsDropdown />,
    },
    {
      href: "/about-us",
      label: "OUR WORLD",
      dropdown: <OurWorldDropdown />,
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
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
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
        <Dropdowns
          dropdown={links[activeIndex].dropdown}
          setActiveIndex={setActiveIndex}
        />
      )}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={links}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default NavBar;
